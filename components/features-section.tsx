"use client"

import { BarChart3, Bot, TrendingUp, Calculator, Target, Shield } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description: "Visualize your income and expenses with auto-generated charts and insights.",
  },
  {
    icon: Bot,
    title: "AI Advisor",
    description: "Get personalized financial advice powered by advanced AI technology.",
  },
  {
    icon: TrendingUp,
    title: "Live Market",
    description: "Track stocks and IPOs in real-time with zero latency data feeds.",
  },
  {
    icon: Calculator,
    title: "SIP Calculator",
    description: "Plan your investments with our powerful compound interest calculator.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set financial goals and track your progress with visual milestones.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your financial data stays secure with local-first storage architecture.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to
            <br />
            <span className="gradient-text">master your finances</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful tools designed for the modern investor. Simple, fast, and intelligent.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-8 transition-all duration-300 hover:bg-secondary/50 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
