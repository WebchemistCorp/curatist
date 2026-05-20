-- Curatist Supabase schema.
-- brain.db 의 cur_* 테이블과 1:1 대응. Asurada sync 루프가 updated_at 기준 양방향 동기화.
-- 네이밍: public.cur_<table>
--
-- 적용:
--   psql "$ASURADA_DATABASE_URL" -f supabase/migrations/0001_init.sql

-- ── cur_mails (답장 필요 메일 관리) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.cur_mails (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    from_name    TEXT,
    from_email   TEXT NOT NULL,
    subject      TEXT NOT NULL,
    priority     TEXT NOT NULL DEFAULT 'normal', -- 'high' | 'normal'
    status       TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'done'
    received_at  TEXT,
    responded_at TEXT,
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL,
    updated_at   TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cur_mails_user        ON public.cur_mails(user_id);
CREATE INDEX IF NOT EXISTS idx_cur_mails_user_status ON public.cur_mails(user_id, status);
CREATE INDEX IF NOT EXISTS idx_cur_mails_updated     ON public.cur_mails(updated_at);

-- ── cur_schedules (일정 관리) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cur_schedules (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    title      TEXT NOT NULL,
    type       TEXT NOT NULL DEFAULT 'personal', -- 'meeting' | 'deadline' | 'personal' | 'reminder'
    at         TEXT NOT NULL,                    -- YYYY-MM-DD 또는 YYYY-MM-DD HH:MM
    location   TEXT,
    notes      TEXT,
    status     TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled' | 'done' | 'cancelled'
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cur_sched_user        ON public.cur_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_cur_sched_user_at     ON public.cur_schedules(user_id, at);
CREATE INDEX IF NOT EXISTS idx_cur_sched_updated     ON public.cur_schedules(updated_at);

-- ── cur_spending (소비 기록) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cur_spending (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    amount     NUMERIC(15, 2) NOT NULL,
    currency   TEXT NOT NULL DEFAULT 'KRW',
    category   TEXT NOT NULL, -- '식비' | '교통' | '구독' | '쇼핑' | '의료' | '기타'
    note       TEXT,
    date       TEXT NOT NULL, -- YYYY-MM-DD
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cur_spending_user      ON public.cur_spending(user_id);
CREATE INDEX IF NOT EXISTS idx_cur_spending_user_date ON public.cur_spending(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_cur_spending_updated   ON public.cur_spending(updated_at);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.cur_mails     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cur_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cur_spending  ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'public.cur_mails', 'public.cur_schedules', 'public.cur_spending'
    ] LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS "authenticated rw" ON %s;
             CREATE POLICY "authenticated rw" ON %s FOR ALL TO authenticated USING (true) WITH CHECK (true);',
            t, t
        );
    END LOOP;
END $$;
