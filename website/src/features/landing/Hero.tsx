import React from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRIMARY = '#8b5cf6'
const PRIMARY_HOVER = '#a78bfa'
const BG = '#09090b'

export const Hero: React.FC = () => (
  <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="orb absolute rounded-full" style={{ width: 700, height: 700, background: PRIMARY, opacity: 0.18, filter: 'blur(120px)', top: '-20%', right: '-20%' }} />
      <div className="orb absolute rounded-full" style={{ width: 550, height: 550, background: PRIMARY, opacity: 0.13, filter: 'blur(100px)', bottom: '-15%', left: '-15%', animationDelay: '3s' }} />
      <div className="float absolute rounded-full" style={{ width: 300, height: 300, background: PRIMARY_HOVER, opacity: 0.10, filter: 'blur(60px)', top: '25%', left: '15%', animationDelay: '4s' }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${PRIMARY}10 1px, transparent 1px), linear-gradient(90deg, ${PRIMARY}10 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: `linear-gradient(to top, ${BG}, transparent)` }} />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 w-full pt-20 pb-16">
      <div className="flex flex-col items-center text-center space-y-8">
        <div
          className="reveal flex items-center gap-3 px-3 py-1.5 rounded-full"
          style={{ background: `${PRIMARY}1a`, border: `1px solid ${PRIMARY}33`, animationDelay: '100ms' }}
        >
          <Sparkles size={12} style={{ color: PRIMARY }} />
          <span className="text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: PRIMARY }}>
            개인 비서 CLI
          </span>
        </div>

        <h1
          className="reveal text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-zinc-50"
          style={{ animationDelay: '150ms', wordBreak: 'keep-all' }}
        >
          당신의 일상을
          <br />
          <span style={{ color: PRIMARY_HOVER }}>큐레이션합니다</span>
        </h1>

        <p className="reveal text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed" style={{ animationDelay: '200ms', wordBreak: 'keep-all' }}>
          이메일, 일정, 소비습관까지 — Curatist가 당신의 하루를 정리합니다.
          <br />
          Asurada System이 패턴을 기억하고 더 나은 루틴을 제안합니다.
        </p>

        <div className="reveal flex items-center gap-3 flex-wrap justify-center" style={{ animationDelay: '250ms' }}>
          <Button
            disabled
            className="flex items-center gap-2 rounded-full px-8 py-4 h-auto font-semibold text-sm text-white cursor-not-allowed opacity-50"
            style={{ background: PRIMARY }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
            개발 중
          </Button>
          <Button asChild variant="ghost" className="rounded-full px-6 py-4 h-auto border border-zinc-700/60 text-zinc-300 hover:text-zinc-100 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-500">
            <a href="#about">더 알아보기</a>
          </Button>
        </div>

        <div className="reveal w-full max-w-2xl mt-4" style={{ animationDelay: '350ms' }}>
          <div className="p-1.5 rounded-2xl bg-zinc-800/40 border border-zinc-700/40">
            <div className="p-4 bg-zinc-900/80 border border-zinc-800/60 rounded-xl font-mono text-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <p className="text-zinc-600">$ <span className="text-zinc-300">curatist mail summary</span></p>
              <p className="mt-1" style={{ color: PRIMARY }}>→ 읽지 않은 메일 14통 중 중요 3통 요약 완료</p>
              <p className="text-zinc-600 mt-2">$ <span className="text-zinc-300">curatist spend report --month 2026-05</span></p>
              <p className="mt-1" style={{ color: PRIMARY }}>→ 5월 지출 합계: 1,240,000원</p>
              <p className="mt-0.5" style={{ color: PRIMARY_HOVER }}>→ 구독 중복 감지: 유사 서비스 2개 — 정리 추천</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
