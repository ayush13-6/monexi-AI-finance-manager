"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { DashboardPage } from "@/components/dashboard-page"
import { ToolsPage } from "@/components/tools-page"
import { AiAdvisorPage } from "@/components/ai-advisor-page"
import { TermsPage } from "@/components/terms-page"
import { AuthPage } from "@/components/auth-page"

export type PageType = "home" | "dashboard" | "tools" | "ai-advisor" | "terms"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Auth error:", error)
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setCurrentPage("home")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    )
  }

  if (!session && (currentPage === "dashboard" || currentPage === "tools" || currentPage === "ai-advisor")) {
    return <AuthPage onAuthSuccess={() => setCurrentPage(currentPage)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === "home" && (
        <main>
          <HeroSection onGetStarted={() => setCurrentPage("dashboard")} />
          <FeaturesSection />
          <FaqSection />
          <Footer onNavigate={(page) => setCurrentPage(page as PageType)} />
        </main>
      )}

      {currentPage === "dashboard" && session && <DashboardPage userEmail={session.user?.email} />}
      {currentPage === "tools" && session && <ToolsPage />}
      {currentPage === "ai-advisor" && session && <AiAdvisorPage />}
      {currentPage === "terms" && <TermsPage />}
    </div>
  )
}
