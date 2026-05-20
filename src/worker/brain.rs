// Curatist ↔ brain.db thin client.
// Asurada 가 schema migration owner. Curatist 는 cur_* 테이블에만 읽기/쓰기.
#![allow(dead_code, clippy::too_many_arguments)]

use anyhow::{anyhow, Context, Result};
use chrono::Utc;
use rusqlite::{params, Connection};
use std::path::Path;

pub fn open(path: &Path) -> Result<Connection> {
    if !path.exists() {
        return Err(anyhow!(
            "brain.db not found at {}.\nasurada init 을 먼저 실행하세요.",
            path.display()
        ));
    }
    let conn = Connection::open(path).with_context(|| format!("open {}", path.display()))?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.pragma_update(None, "busy_timeout", 5000)?;
    conn.pragma_update(None, "foreign_keys", "ON")?;

    for table in &["cur_mails", "cur_schedules", "cur_spending"] {
        let exists: i64 = conn
            .query_row(
                &format!(
                    "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='{}'",
                    table
                ),
                [],
                |r| r.get(0),
            )
            .unwrap_or(0);
        if exists == 0 {
            return Err(anyhow!(
                "{} 테이블이 없습니다.\ncuratist setup 을 먼저 실행하세요.",
                table
            ));
        }
    }
    Ok(conn)
}

pub fn uuid_like() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let pid = std::process::id();
    let rand = std::ptr::addr_of!(nanos) as usize;
    format!("{:016x}-{:08x}-{:08x}", nanos, pid, rand)
}

// ── 이메일 ─────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct Mail {
    pub id: String,
    pub from_name: Option<String>,
    pub from_email: String,
    pub subject: String,
    pub priority: String,
    pub status: String,
    pub received_at: Option<String>,
    pub notes: Option<String>,
}

pub fn mail_insert(
    conn: &Connection,
    user_id: &str,
    from_email: &str,
    subject: &str,
    from_name: Option<&str>,
    priority: &str,
    received_at: Option<&str>,
    notes: Option<&str>,
) -> Result<String> {
    let id = uuid_like();
    let now = Utc::now().to_rfc3339();
    conn.execute(
        r#"INSERT INTO cur_mails
           (id, user_id, from_name, from_email, subject, priority, status,
            received_at, notes, created_at, updated_at)
           VALUES (?1,?2,?3,?4,?5,?6,'pending',?7,?8,?9,?9)"#,
        params![id, user_id, from_name, from_email, subject, priority, received_at, notes, now],
    )?;
    Ok(id)
}

pub fn mail_list(conn: &Connection, user_id: &str, all: bool) -> Result<Vec<Mail>> {
    let sql = if all {
        "SELECT id, from_name, from_email, subject, priority, status, received_at, notes
         FROM cur_mails WHERE user_id=?1 ORDER BY
         CASE priority WHEN 'high' THEN 0 ELSE 1 END, created_at DESC LIMIT 50"
    } else {
        "SELECT id, from_name, from_email, subject, priority, status, received_at, notes
         FROM cur_mails WHERE user_id=?1 AND status='pending' ORDER BY
         CASE priority WHEN 'high' THEN 0 ELSE 1 END, created_at DESC"
    };
    let mut stmt = conn.prepare(sql)?;
    let rows = stmt
        .query_map(params![user_id], |row| {
            Ok(Mail {
                id: row.get(0)?,
                from_name: row.get(1)?,
                from_email: row.get(2)?,
                subject: row.get(3)?,
                priority: row.get(4)?,
                status: row.get(5)?,
                received_at: row.get(6)?,
                notes: row.get(7)?,
            })
        })?
        .filter_map(|r| r.ok())
        .collect();
    Ok(rows)
}

pub fn mail_done(conn: &Connection, id: &str, user_id: &str) -> Result<bool> {
    let now = Utc::now().to_rfc3339();
    let n = conn.execute(
        "UPDATE cur_mails SET status='done', responded_at=?1, updated_at=?1 WHERE id=?2 AND user_id=?3",
        params![now, id, user_id],
    )?;
    Ok(n > 0)
}

// ── 일정 ───────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct Schedule {
    pub id: String,
    pub title: String,
    pub r#type: String,
    pub at: String,
    pub location: Option<String>,
    pub notes: Option<String>,
    pub status: String,
}

pub fn cal_insert(
    conn: &Connection,
    user_id: &str,
    title: &str,
    cal_type: &str,
    at: &str,
    location: Option<&str>,
    notes: Option<&str>,
) -> Result<String> {
    let id = uuid_like();
    let now = Utc::now().to_rfc3339();
    conn.execute(
        r#"INSERT INTO cur_schedules
           (id, user_id, title, type, at, location, notes, status, created_at, updated_at)
           VALUES (?1,?2,?3,?4,?5,?6,?7,'scheduled',?8,?8)"#,
        params![id, user_id, title, cal_type, at, location, notes, now],
    )?;
    Ok(id)
}

pub fn cal_list(conn: &Connection, user_id: &str, upcoming_only: bool) -> Result<Vec<Schedule>> {
    let sql = if upcoming_only {
        "SELECT id, title, type, at, location, notes, status
         FROM cur_schedules WHERE user_id=?1 AND status='scheduled' AND at >= datetime('now')
         ORDER BY at ASC LIMIT 20"
    } else {
        "SELECT id, title, type, at, location, notes, status
         FROM cur_schedules WHERE user_id=?1
         ORDER BY at DESC LIMIT 30"
    };
    let mut stmt = conn.prepare(sql)?;
    let rows = stmt
        .query_map(params![user_id], |row| {
            Ok(Schedule {
                id: row.get(0)?,
                title: row.get(1)?,
                r#type: row.get(2)?,
                at: row.get(3)?,
                location: row.get(4)?,
                notes: row.get(5)?,
                status: row.get(6)?,
            })
        })?
        .filter_map(|r| r.ok())
        .collect();
    Ok(rows)
}

pub fn cal_done(conn: &Connection, id: &str, user_id: &str) -> Result<bool> {
    let now = Utc::now().to_rfc3339();
    let n = conn.execute(
        "UPDATE cur_schedules SET status='done', updated_at=?1 WHERE id=?2 AND user_id=?3",
        params![now, id, user_id],
    )?;
    Ok(n > 0)
}

// ── 소비 ───────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct Spending {
    pub id: String,
    pub amount: f64,
    pub currency: String,
    pub category: String,
    pub note: Option<String>,
    pub date: String,
}

pub fn spend_insert(
    conn: &Connection,
    user_id: &str,
    amount: f64,
    category: &str,
    date: &str,
    note: Option<&str>,
) -> Result<String> {
    let id = uuid_like();
    let now = Utc::now().to_rfc3339();
    conn.execute(
        r#"INSERT INTO cur_spending
           (id, user_id, amount, currency, category, note, date, created_at, updated_at)
           VALUES (?1,?2,?3,'KRW',?4,?5,?6,?7,?7)"#,
        params![id, user_id, amount, category, note, date, now],
    )?;
    Ok(id)
}

pub fn spend_list(conn: &Connection, user_id: &str, month: Option<&str>) -> Result<Vec<Spending>> {
    let (sql, bind_month) = if let Some(m) = month {
        (
            "SELECT id, amount, currency, category, note, date
             FROM cur_spending WHERE user_id=?1 AND date LIKE ?2
             ORDER BY date DESC",
            Some(format!("{}%", m)),
        )
    } else {
        (
            "SELECT id, amount, currency, category, note, date
             FROM cur_spending WHERE user_id=?1
             ORDER BY date DESC LIMIT 50",
            None,
        )
    };
    let mut stmt = conn.prepare(sql)?;
    let rows = if let Some(m) = bind_month {
        stmt.query_map(params![user_id, m], row_to_spending)?
            .filter_map(|r| r.ok())
            .collect()
    } else {
        stmt.query_map(params![user_id], row_to_spending)?
            .filter_map(|r| r.ok())
            .collect()
    };
    Ok(rows)
}

pub fn spend_report(conn: &Connection, user_id: &str, month: &str) -> Result<Vec<(String, f64)>> {
    let prefix = format!("{}%", month);
    let mut stmt = conn.prepare(
        "SELECT category, SUM(amount) FROM cur_spending
         WHERE user_id=?1 AND date LIKE ?2
         GROUP BY category ORDER BY SUM(amount) DESC",
    )?;
    let rows = stmt
        .query_map(params![user_id, prefix], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, f64>(1)?))
        })?
        .filter_map(|r| r.ok())
        .collect();
    Ok(rows)
}

fn row_to_spending(row: &rusqlite::Row<'_>) -> rusqlite::Result<Spending> {
    Ok(Spending {
        id: row.get(0)?,
        amount: row.get(1)?,
        currency: row.get(2)?,
        category: row.get(3)?,
        note: row.get(4)?,
        date: row.get(5)?,
    })
}
