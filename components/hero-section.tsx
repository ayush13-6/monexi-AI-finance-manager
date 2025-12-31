"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap, Play, X } from "lucide-react"
import ThreeDBackground from "@/components/ui/star-background"

interface HeroSectionProps {
  onGetStarted: () => void
}

const YOUTUBE_VIDEO_ID = "3eLze3Z6OlU"

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* 1. The Background */}
      <ThreeDBackground />
      
      {/* 2. The Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
        
        {/* Badge Removed Completely */}

        {/* Main Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            Finance without
          </span>
          <br />
          <span className="text-white">the complexity.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed"
          style={{ animationDelay: "0.2s" }}
        >
          Smart budgeting, AI-powered advice, and real-time market tracking. Experience the future of personal finance
          management.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all text-base px-8 py-6 w-full sm:w-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Get started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowVideo(true)}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white active:bg-white/20 active:scale-95 backdrop-blur-md transition-all text-base px-8 py-6 w-full sm:w-auto focus:ring-0"
          >
            <Play className="mr-2 h-5 w-5 fill-white/20" />
            Watch demo
          </Button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span className="text-3xl font-bold text-white">12%</span>
            </div>
            <span className="text-sm text-zinc-400">Avg. savings increase</span>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              <span className="text-3xl font-bold text-white">100%</span>
            </div>
            <span className="text-sm text-zinc-400">Privacy first</span>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              <span className="text-3xl font-bold text-white">24/7</span>
            </div>
            <span className="text-sm text-zinc-400">AI assistance</span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowVideo(false)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-video bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 z-10"
            >
              <span className="text-sm">Close</span>
              <X className="h-6 w-6" />
            </button>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
              {YOUTUBE_VIDEO_ID !== "YOUR_VIDEO_ID_HERE" ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="Monexi Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-zinc-500">Video placeholder</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Welcome to Monexi</h4>
                <p className="text-sm text-zinc-400">Your personal finance companion</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVideo(false)
                  onGetStarted()
                }}
                className="!bg-transparent border-zinc-700 hover:bg-zinc-800 text-white backdrop-blur-sm"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}