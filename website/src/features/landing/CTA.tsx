import React from 'react'
import { ArrowRight, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRIMARY = '#8b5cf6'

const INSTALL_STEPS = [
  { cmd: 'brew install webchemistcorp/tap/curatist', label: 'Homebrew (macOS / Linux)' },
  { cmd: 'curatist setup', label: '초기 설정' },
  { cmd: 'curatist --help', label: '시작하기' },
]

export const CTA: React.FC = () => (
  <section id="cta" className="py-32 px-6">
    <div className="max-w-4xl mx-auto space-y-16">

      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: PRIMARY }}>시작하기</p>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-50" style={{ wordBreak: 'keep-all' }}>
          지금 바로
          <br />
          <span style={{ color: PRIMARY }}>당신의 일상을 정리하세요</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto" style={{ wordBreak: 'keep-all' }}>
          터미널 하나로 이메일, 일정, 소비를 한번에 관리합니다.
        </p>
      </div>

      <div className="rounded-2xl p-8 border space-y-5" style={{ background: `${PRIMARY}08`, borderColor: `${PRIMARY}22` }}>
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={16} style={{ color: PRIMARY }} />
          <p className="text-sm font-semibold text-zinc-300">설치 방법</p>
        </div>
        <div className="space-y-3">
          {INSTALL_STEPS.map(({ cmd, label }, i) => (
            <div key={cmd} className="space-y-1">
              <p className="text-xs text-zinc-600 font-mono">{`# ${i + 1}. ${label}`}</p>
              <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800/60 rounded-xl px-4 py-3 font-mono text-sm">
                <span className="text-zinc-600">$</span>
                <span className="text-zinc-200">{cmd}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700/40 bg-zinc-800/30">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PRIMARY }} />
          <span className="text-zinc-400 text-sm font-medium">개발 중 — 출시 예정</span>
        </div>
        <Button asChild variant="ghost" className="rounded-full px-6 py-4 h-auto border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-all duration-500">
          <a href="https://github.com/WebchemistCorp/curatist" target="_blank" rel="noreferrer">
            소스코드 보기
            <ArrowRight size={14} />
          </a>
        </Button>
      </div>

    </div>
  </section>
)
