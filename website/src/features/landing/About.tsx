import React from 'react'
import { Brain, Sparkles, Zap } from 'lucide-react'

const PRIMARY = '#8b5cf6'

const DIFF_ITEMS = [
  {
    label: '기존 방식',
    points: ['앱마다 흩어진 일정·이메일·지출 정보', '중요한 것을 놓치고 나서야 인지', '소비 패턴 파악 없이 반복되는 지출'],
    accent: '#ef4444',
    dim: true,
  },
  {
    label: 'Curatist',
    points: ['하나의 CLI로 일상 정보 통합 관리', 'Asurada가 중요도를 판단하고 먼저 알림', '소비 패턴 분석으로 불필요한 지출 제거'],
    accent: PRIMARY,
    dim: false,
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
          <span style={{ color: PRIMARY }}>Curator</span> + As<span style={{ color: PRIMARY }}>ist</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ wordBreak: 'keep-all' }}>
          큐레이터처럼 당신의 일상을 선별하고 정리하는 개인 비서.
          <br />
          Curatist는 흩어진 정보를 모아 당신이 집중해야 할 것만 남깁니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {DIFF_ITEMS.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-8 border space-y-5"
            style={{
              background: item.dim ? 'rgba(255,255,255,0.02)' : `${item.accent}0d`,
              borderColor: item.dim ? 'rgba(255,255,255,0.06)' : `${item.accent}33`,
            }}
          >
            <p className="font-semibold text-lg" style={{ color: item.dim ? '#ffffff' : item.accent }}>
              {item.label}
            </p>
            <ul className="space-y-3">
              {item.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dim ? '#ef4444' : item.accent }} />
                  {p}
                </li>
              ))}
            </ul>
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
