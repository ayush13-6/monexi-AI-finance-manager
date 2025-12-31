"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Loader2, CheckCircle2, LockKeyhole, KeyRound, AlertCircle, Lock, ArrowLeft } from "lucide-react"

// --- CSS STYLES ---
const styles = `
  .monexi-text {
    background: linear-gradient(135deg, #ffffff 0%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: -20px 0 40px rgba(0,0,0,0.5);
  }
  .input-glow:focus {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.4);
  }
  .custom-tab[data-state='active'] {
    background-color: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  .custom-tab {
    color: #71717a;
  }
`

interface AuthPageProps {
  onAuthSuccess: () => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  // --- STATE LOGIC ---
  const [activeTab, setActiveTab] = useState("login")
  const [signupStep, setSignupStep] = useState<"email" | "otp" | "set-password">("email")
  
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [timer, setTimer] = useState(0)
  
  const supabase = createClient()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // --- 3D ANIMATION LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const GLOBE_RADIUS = 320 
    const DOT_COUNT = 800    
    const DOT_SIZE = 1.4     
    const PERSPECTIVE = 800
    const GLOBE_Y_OFFSET = 20 

    let width = 0
    let height = 0

    const handleResize = () => {
        const parent = canvas.parentElement
        if (parent) {
            const dpr = window.devicePixelRatio || 1
            const rect = parent.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            ctx.scale(dpr, dpr)
            width = rect.width
            height = rect.height
        }
    }
    handleResize()

    const dots: any[] = []
    for (let i = 0; i < DOT_COUNT; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos((Math.random() * 2) - 1)
      dots.push({
        x: GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta),
        y: GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta),
        z: GLOBE_RADIUS * Math.cos(phi),
        xProjected: 0, yProjected: 0, scaleProjected: 0
      })
    }

    let rotationAngle = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const PROJECTION_CENTER_X = width / 2
      const PROJECTION_CENTER_Y = (height / 2) + GLOBE_Y_OFFSET
      rotationAngle += 0.0008 
      
      const rotationSin = Math.sin(rotationAngle)
      const rotationCos = Math.cos(rotationAngle)

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        const rotX = dot.x * rotationCos - dot.z * rotationSin
        const rotZ = dot.z * rotationCos + dot.x * rotationSin
        let rotY = dot.y 
        const tiltAngle = 0.2
        const yNew = rotY * Math.cos(tiltAngle) - rotZ * Math.sin(tiltAngle)
        const zNew = rotZ * Math.cos(tiltAngle) + rotY * Math.sin(tiltAngle)
        rotY = yNew
        const zFinal = zNew + 10
        const scaleProjected = PERSPECTIVE / (PERSPECTIVE + zFinal)
        const xProjected = (rotX * scaleProjected) + PROJECTION_CENTER_X
        const yProjected = (rotY * scaleProjected) + PROJECTION_CENTER_Y
        dots[i].xProjected = xProjected
        dots[i].yProjected = yProjected
        dots[i].scaleProjected = scaleProjected
        const alpha = Math.max(0.02, Math.min(0.4, (scaleProjected - 0.5) * 1.5))
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(xProjected, yProjected, DOT_SIZE * scaleProjected, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981" 
        ctx.fill()
      }
      ctx.globalAlpha = 0.05 
      ctx.strokeStyle = "#34d399"
      ctx.lineWidth = 0.4    
      for (let i = 0; i < dots.length; i++) {
         for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].xProjected - dots[j].xProjected
            const dy = dots[i].yProjected - dots[j].yProjected
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 45) {
               ctx.beginPath()
               ctx.moveTo(dots[i].xProjected, dots[i].yProjected)
               ctx.lineTo(dots[j].xProjected, dots[j].yProjected)
               ctx.stroke()
            }
         }
      }
      requestAnimationFrame(render)
    }
    render()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  // --- AUTH HANDLERS ---
  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be 8+ chars."
    if (!/[A-Z]/.test(pass)) return "Needs 1 Capital letter."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Needs 1 Special char."
    return null
  }

  const checkUserExists = async (emailToCheck: string) => {
    try {
        const { data: userExists, error } = await supabase.rpc('check_email_exists', { email_input: emailToCheck })
        if (error) throw error
        return userExists
    } catch (err) {
        console.error("RPC Error:", err)
        return false 
    }
  }

  const handleSendOtp = async (e: React.FormEvent, type: "signup" | "reset") => {
    e.preventDefault()
    setLoading(true); setError(""); setMessage("")
    
    if (timer > 0) {
       setError(`Wait ${timer}s`); setLoading(false); return
    }

    const exists = await checkUserExists(email)

    if (type === "signup" && exists) {
        setError("Account already exists. Please Login.")
        setLoading(false)
        return
    }

    if (type === "reset" && !exists) {
        setError("No account found with this email.")
        setLoading(false)
        return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: type === "signup" },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage("Verification code sent!")
      setSignupStep("otp")
      setTimer(60)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" })
    
    setLoading(false)
    if (error) {
      setError("Incorrect code.")
    } else {
      setSignupStep("set-password")
      setMessage("")
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    
    const valError = validatePassword(password)
    if (valError) { setError(valError); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: password })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onAuthSuccess()
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError("Invalid credentials.")
      setLoading(false)
    } else {
      onAuthSuccess()
    }
  }

  const switchTab = (tab: string) => {
    setActiveTab(tab)
    setError(""); setMessage(""); setEmail(""); setPassword(""); setOtp(""); setConfirmPassword("")
    setSignupStep("email")
  }

  const getHeader = () => {
      if (activeTab === 'forgot') return { title: "Reset Password", desc: "Recover access to your account." }
      if (activeTab === 'signup') return { title: "Create Account", desc: "Start your financial journey." }
      return { title: "Welcome Back", desc: "Enter your credentials to access." }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-screen w-full flex bg-[#000000] text-white font-sans overflow-hidden">
        
        {/* --- LEFT SIDE: ANIMATION --- */}
        <div className="hidden lg:flex flex-[1.2] relative items-center justify-center bg-black overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />
            <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center justify-center p-8 pointer-events-none select-none">
                <div className="w-20 h-20 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-center mb-6 backdrop-blur-md shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    <span className="text-5xl font-bold text-emerald-400">M</span>
                </div>
                <h1 className="text-8xl font-bold tracking-tighter monexi-text mb-6 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    MONEXI
                </h1>
                <div className="bg-black/30 backdrop-blur-sm px-8 py-4 rounded-full border border-white/5">
                    <p className="text-xl text-emerald-100/80 font-light text-center">
                        The Future of <span className="font-semibold text-emerald-400">Digital Finance</span> is here.
                    </p>
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="flex-1 flex items-center justify-center p-8 relative glass-panel z-20">
            <div className="w-full max-w-[420px]">
                
                <Tabs value={activeTab} onValueChange={switchTab} className="w-full">
                  <div className="flex flex-col mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {getHeader().title}
                      </h2>
                      <p className="text-zinc-500 mb-6">
                        {getHeader().desc}
                      </p>
                      
                      {activeTab !== 'forgot' && (
                          <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 p-1 rounded-xl border border-white/10">
                            <TabsTrigger value="login" className="custom-tab rounded-lg data-[state=active]:text-emerald-400">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="custom-tab rounded-lg data-[state=active]:text-emerald-400">New Account</TabsTrigger>
                          </TabsList>
                      )}
                  </div>

                  {error && <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/10 flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
                  {message && <div className="mb-4 text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/10 flex items-center gap-2"><CheckCircle2 size={16}/> {message}</div>}

                  {/* --- TAB 1: LOGIN FLOW --- */}
                  <TabsContent value="login">
                    <form onSubmit={handlePasswordLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                                    placeholder="name@company.com" />
                            </div>
                        </div>
                        
                        {/* --- PASSWORD FIELD --- */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                                    placeholder="••••••••" />
                            </div>
                        </div>

                        {/* --- FORGOT PASSWORD LINK (MOVED HERE) --- */}
                        <div className="flex justify-end">
                            <button type="button" onClick={() => switchTab('forgot')} className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-medium">
                                Forgot Password?
                            </button>
                        </div>

                        <Button type="submit" disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all mt-1">
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </Button>
                    </form>
                  </TabsContent>

                  {/* --- TAB 2: SIGNUP FLOW --- */}
                  <TabsContent value="signup">
                    {signupStep === "email" && (
                        <form onSubmit={(e) => handleSendOtp(e, "signup")} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                                        placeholder="name@company.com" />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-2">
                                {loading ? <Loader2 className="animate-spin" /> : "Send Verification Code"}
                            </Button>
                        </form>
                    )}

                    {signupStep === "otp" && (
                        <OtpForm 
                            otp={otp} setOtp={setOtp} 
                            loading={loading} onSubmit={handleVerifyOtp} 
                            onBack={() => setSignupStep("email")} 
                        />
                    )}
                    {signupStep === "set-password" && (
                         <SetPasswordForm 
                            password={password} setPassword={setPassword}
                            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                            loading={loading} onSubmit={handleSetPassword}
                         />
                    )}
                  </TabsContent>

                  {/* --- TAB 3: FORGOT PASSWORD FLOW --- */}
                  <TabsContent value="forgot">
                     <button onClick={() => switchTab('login')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 text-sm transition-colors">
                        <ArrowLeft size={16}/> Back to Login
                     </button>

                     {signupStep === "email" && (
                        <form onSubmit={(e) => handleSendOtp(e, "reset")} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                             <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Registered Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                                        placeholder="name@company.com" />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-2">
                                {loading ? <Loader2 className="animate-spin" /> : "Send Recovery Code"}
                            </Button>
                        </form>
                     )}

                     {signupStep === "otp" && (
                        <OtpForm 
                            otp={otp} setOtp={setOtp} 
                            loading={loading} onSubmit={handleVerifyOtp} 
                            onBack={() => setSignupStep("email")} 
                        />
                    )}
                    {signupStep === "set-password" && (
                         <SetPasswordForm 
                            password={password} setPassword={setPassword}
                            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                            loading={loading} onSubmit={handleSetPassword}
                            isReset={true}
                         />
                    )}
                  </TabsContent>

                </Tabs>

                <div className="mt-8 text-center">
                     <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
                         Secured by Monexi Protocol
                     </p>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

function OtpForm({ otp, setOtp, loading, onSubmit, onBack }: any) {
    return (
        <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Enter Code</label>
                <div className="relative group">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white tracking-[0.5em] text-center font-mono focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                        placeholder="000000" />
                </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-2">
                {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
            </Button>
            <button type="button" onClick={onBack} className="w-full text-xs text-zinc-500 hover:text-white mt-4">Change Email</button>
        </form>
    )
}

function SetPasswordForm({ password, setPassword, confirmPassword, setConfirmPassword, loading, onSubmit, isReset = false }: any) {
    return (
        <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-2">
                <p className="text-xs text-emerald-300 flex items-center gap-2"><CheckCircle2 size={14}/> Verified! {isReset ? "Reset your password." : "Set your password."}</p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                        placeholder="Min 8 chars, 1 Capital, 1 Special" />
                </div>
                <div className="flex flex-col gap-1 mt-2 pl-2">
                    <span className={`text-[10px] flex items-center gap-1 transition-colors ${password.length >= 8 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        • At least 8 characters
                    </span>
                    <span className={`text-[10px] flex items-center gap-1 transition-colors ${/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        • At least 1 Capital letter
                    </span>
                    <span className={`text-[10px] flex items-center gap-1 transition-colors ${/[!@#$%^&*]/.test(password) ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        • At least 1 Special character
                    </span>
                </div>
            </div>
            
            <div className="space-y-2 mt-4">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/40 input-glow transition-all"
                        placeholder="Re-enter password" 
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-2">
                {loading ? <Loader2 className="animate-spin" /> : isReset ? "Reset & Login" : "Save Password & Login"}
            </Button>
        </form>
    )
}