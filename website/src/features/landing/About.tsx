import React from 'react'
import { Brain, Sparkles, Zap } from 'lucide-react'

const PRIMARY = '#8b5cf6'

const SCENARIOS = [
  {
    situation: '오늘 뭐가 중요한지 모를 때',
    cmd: 'curatist mail inbox --priority',
    result: '우선순위 높은 메일 3개 · 나머지 12개 필터링',
  },
  {
    situation: '이번 달 지출 점검할 때',
    cmd: 'curatist spend summary --month this',
    result: '총 482,000원 · 카페 32% · 구독 28%',
  },
  {
    situation: '오늘 일정 한눈에 볼 때',
    cmd: 'curatist schedule today',
    result: '미팅 2개 · 마감 1개 · 여유 시간 3h',
  },
  {
    situation: '불필요한 구독 찾을 때',
    cmd: 'curatist spend --category 구독 --unused',
    result: '3개 서비스 · 월 24,900원 절약 가능',
  },
]

const ASURADA_POINTS = [
  { icon: Brain, text: '이메일, 일정, 소비 패턴을 기억하고 개인화 학습' },
  { icon: Zap, text: '반복되는 루틴을 분석해 더 효율적인 하루를 제안' },
  { icon: Sparkles, text: '중요도 기반으로 정보를 큐레이션해 노이즈 제거' },
]

export const About: React.FC = () => (
  <section id="about" className="py-32 px-6">
    <div className="max-w-6xl mx-auto space-y-24">

      <div className="text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: PRIMARY }}>About Curatist</p>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 leading-tight" style={{ wordBreak: 'keep-all' }}>
          흩어진 일상,<br />
          <span style={{ color: PRIMARY }}>필요한 것만 남깁니다</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ wordBreak: 'keep-all' }}>
          이메일, 일정, 소비를 하나의 터미널에서.<br />
          Curatist는 중요한 것만 골라내는 개인 큐레이터입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {SCENARIOS.map(({ situation, cmd, result }) => (
          <div
            key={cmd}
            className="rounded-2xl p-6 border space-y-4"
            style={{ background: `${PRIMARY}08`, borderColor: `${PRIMARY}1a` }}
          >
            <p className="text-xs text-zinc-500 font-medium tracking-wide">{situation}</p>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/60 rounded-xl px-4 py-2.5 font-mono text-sm">
              <span className="text-zinc-600">$</span>
              <span className="text-zinc-200">{cmd}</span>
            </div>
            <p className="text-sm font-mono" style={{ color: PRIMARY }}>→ {result}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-10 border" style={{ background: `${PRIMARY}08`, borderColor: `${PRIMARY}22` }}>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color: PRIMARY }}>Core System</p>
            <h3 className="text-3xl font-bold text-zinc-50">Asurada System</h3>
            <p className="text-zinc-400 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
              Curatist의 핵심 엔진. 자율학습 AI 시스템으로 개인의 생활 패턴을 기억합니다.
              단순 알림 도구가 아닌, 당신의 하루를 이해하는 개인 큐레이터입니다.
            </p>
          </div>
          <ul className="space-y-4">
            {ASURADA_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${PRIMARY}1a` }}>
                  <Icon size={16} style={{ color: PRIMARY }} />
                </span>
                <p className="text-zinc-400 text-sm leading-relaxed pt-1.5" style={{ wordBreak: 'keep-all' }}>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  </section>
)
