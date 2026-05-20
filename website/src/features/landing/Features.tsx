import React from 'react'
import { Bell, Calendar, CreditCard, Mail, RefreshCw, Sparkles } from 'lucide-react'

const PRIMARY = '#8b5cf6'

interface FeatureProps {
  icon: React.ElementType
  title: string
  desc: string
  highlight?: boolean
  soon?: boolean
}

const FEATURES: FeatureProps[] = [
  {
    icon: Mail,
    title: '이메일 관리',
    desc: '받은 메일을 중요도 순으로 요약하고, 답장이 필요한 것만 골라냅니다.',
    highlight: true,
  },
  {
    icon: Calendar,
    title: '일정 관리',
    desc: '오늘의 일정을 한눈에 파악하고 충돌·누락을 미리 감지합니다.',
    highlight: true,
  },
  {
    icon: CreditCard,
    title: '소비습관 관리',
    desc: '월별 지출을 카테고리별로 분석하고 불필요한 구독과 중복 지출을 발견합니다.',
    highlight: true,
  },
  {
    icon: Bell,
    title: '스마트 알림',
    desc: '중요도 기반으로 알림을 필터링 — 정말 중요한 것만 먼저 알려줍니다.',
  },
  {
    icon: RefreshCw,
    title: '루틴 분석',
    desc: '반복되는 패턴을 학습해 더 효율적인 하루 루틴을 제안합니다.',
    soon: true,
  },
  {
    icon: Sparkles,
    title: '전방위 큐레이션',
    desc: '이메일·일정·소비를 넘어 삶의 모든 정보를 통합 큐레이션합니다.',
    soon: true,
  },
]

export const Features: React.FC = () => (
  <section id="features" className="py-32 px-6">
    <div className="max-w-6xl mx-auto space-y-16">

      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: PRIMARY }}>Features</p>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-50" style={{ wordBreak: 'keep-all' }}>
          일상의 노이즈를 걷어냅니다
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto" style={{ wordBreak: 'keep-all' }}>
          당신이 집중해야 할 것만 남기고 나머지는 Curatist가 처리합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc, highlight, soon }) => (
          <div
            key={title}
            className="rounded-2xl p-7 border space-y-4 transition-all duration-300 hover:scale-[1.01] relative"
            style={{
              background: highlight ? `${PRIMARY}0d` : 'rgba(255,255,255,0.02)',
              borderColor: highlight ? `${PRIMARY}33` : 'rgba(255,255,255,0.06)',
            }}
          >
            {soon && (
              <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: `${PRIMARY}22`, color: PRIMARY }}>
                soon
              </span>
            )}
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: highlight ? `${PRIMARY}22` : 'rgba(255,255,255,0.05)' }}
            >
              <Icon size={18} style={{ color: highlight ? PRIMARY : '#71717a' }} />
            </span>
            <div className="space-y-2">
              <p className="font-semibold text-zinc-100">{title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
)
