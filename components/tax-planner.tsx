"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calculator,
  TrendingDown,
  CheckCircle2,
  IndianRupee,
  Lightbulb,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Receipt,
  Building2,
  ShoppingBag,
  Percent,
} from "lucide-react"

// FY 2024-25 New Regime Tax Slabs
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 30 },
]

function calculateNewRegimeTax(income: number): number {
  const taxableIncome = Math.max(0, income - 75000) // Standard deduction

  // Rebate under 87A - No tax if income <= 7L
  if (taxableIncome <= 700000) return 0

  let tax = 0
  let remaining = taxableIncome

  for (const slab of NEW_REGIME_SLABS) {
    if (remaining <= 0) break
    const taxableInSlab = Math.min(remaining, slab.max - slab.min)
    tax += taxableInSlab * (slab.rate / 100)
    remaining -= taxableInSlab
  }

  return Math.round(tax * 1.04) // Add 4% cess
}

// GST Rates
const GST_CATEGORIES = [
  { category: "Essential Items", items: "Milk, Bread, Fresh Vegetables, Fruits", rate: 0 },
  { category: "Basic Necessities", items: "Packaged Food, Tea, Coffee, Sugar, Oil", rate: 5 },
  { category: "Standard Goods", items: "Clothes, Footwear, Electronics under 1000", rate: 12 },
  { category: "Regular Items", items: "Electronics, Appliances, AC, Fridge", rate: 18 },
  { category: "Luxury & Sin Goods", items: "Cars, Tobacco, Aerated Drinks", rate: 28 },
]

export default function TaxPlanner() {
  const [step, setStep] = useState(1)
  const [grossIncome, setGrossIncome] = useState(0)
  const [selectedIncomeRange, setSelectedIncomeRange] = useState("")
  const [gstAmount, setGstAmount] = useState(0)
  const [gstRate, setGstRate] = useState(18)

  const incomeRanges = [
    { label: "Below 5 Lakh", value: 400000, emoji: "💰" },
    { label: "5-7 Lakh", value: 600000, emoji: "💵" },
    { label: "7-10 Lakh", value: 850000, emoji: "💸" },
    { label: "10-15 Lakh", value: 1200000, emoji: "🤑" },
    { label: "15-25 Lakh", value: 2000000, emoji: "💎" },
    { label: "Above 25 Lakh", value: 3000000, emoji: "👑" },
  ]

  const calculations = useMemo(() => {
    const tax = calculateNewRegimeTax(grossIncome)
    const effectiveRate = grossIncome > 0 ? ((tax / grossIncome) * 100).toFixed(1) : "0"
    const monthlyTax = Math.round(tax / 12)
    const takeHome = grossIncome - tax
    const monthlyTakeHome = Math.round(takeHome / 12)

    return { tax, effectiveRate, monthlyTax, takeHome, monthlyTakeHome }
  }, [grossIncome])

  const gstCalculation = useMemo(() => {
    const gstValue = (gstAmount * gstRate) / (100 + gstRate)
    const basePrice = gstAmount - gstValue
    return { gstValue: Math.round(gstValue), basePrice: Math.round(basePrice) }
  }, [gstAmount, gstRate])

  // Get personalized tips based on income
  const getTips = () => {
    if (grossIncome <= 700000) {
      return [
        "Great news! You pay ZERO tax under new regime",
        "Your income qualifies for full rebate under Section 87A",
        "Focus on building an emergency fund with your savings",
        "Start investing in mutual funds via SIP for wealth creation",
      ]
    } else if (grossIncome <= 1000000) {
      return [
        "You're in the 10% tax bracket for income above 7L",
        "Consider NPS for retirement + tax benefits (old regime)",
        "Health insurance is a must - protects you and saves tax",
        "Start SIP of at least 10% of your monthly income",
      ]
    } else if (grossIncome <= 1500000) {
      return [
        "At this income, new regime is usually better",
        "Max out your employer's NPS contribution",
        "Consider term insurance for family protection",
        "Build a diversified portfolio: Equity + Debt + Gold",
      ]
    } else {
      return [
        "High earners benefit from professional tax planning",
        "Consider HUF formation for tax efficiency",
        "Invest in tax-free bonds for regular income",
        "Review both regimes with a CA before filing",
      ]
    }
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">FY 2024-25</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">India Tax Guide</h2>
        <p className="text-muted-foreground">Simple tax calculator with New Regime + GST helper</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === s ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:border-primary/50"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">
              {s}
            </span>
            <span className="text-sm font-medium">{s === 1 ? "Income" : s === 2 ? "Your Tax" : "GST"}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Select Income */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <Label className="text-lg font-semibold flex items-center gap-2 mb-6">
              <IndianRupee className="h-5 w-5 text-primary" />
              What's your annual income?
            </Label>

            {/* Quick Select Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {incomeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setSelectedIncomeRange(range.label)
                    setGrossIncome(range.value)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedIncomeRange === range.label
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{range.emoji}</span>
                  <span className="font-medium text-sm">{range.label}</span>
                </button>
              ))}
            </div>

            {/* Exact Amount Input */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Or enter exact amount</Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={grossIncome || ""}
                    onChange={(e) => {
                      setGrossIncome(Number(e.target.value))
                      setSelectedIncomeRange("")
                    }}
                    placeholder="Enter your annual income"
                    className="pl-8 h-12 text-lg"
                  />
                </div>
                <Button onClick={() => setStep(2)} disabled={grossIncome <= 0} className="h-12 px-6">
                  Calculate <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* New Regime Explanation */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Why New Regime?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Simpler - No need to track deductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Lower rates - 5% starts at 3L (vs 2.5L in old)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Zero tax up to 7L income (with rebate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Default regime from FY 2023-24 onwards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Tax Results */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Annual Tax (New Regime)</p>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">₹{calculations.tax.toLocaleString()}</div>
            <p className="text-muted-foreground">{calculations.effectiveRate}% effective tax rate</p>

            {calculations.tax === 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">You pay ZERO tax!</span>
              </div>
            )}
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Gross Income</p>
              <p className="text-xl font-bold">₹{(grossIncome / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly Tax</p>
              <p className="text-xl font-bold">₹{calculations.monthlyTax.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Take Home/Year</p>
              <p className="text-xl font-bold text-primary">₹{(calculations.takeHome / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Take Home/Month</p>
              <p className="text-xl font-bold text-primary">₹{calculations.monthlyTakeHome.toLocaleString()}</p>
            </div>
          </div>

          {/* Tax Slabs Visual */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              New Regime Tax Slabs (FY 2024-25)
            </h4>
            <div className="space-y-3">
              {NEW_REGIME_SLABS.map((slab, i) => {
                const isActive = grossIncome - 75000 > slab.min
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`w-16 text-center py-2 rounded-lg font-bold ${
                        slab.rate === 0
                          ? "bg-green-500/20 text-green-500"
                          : isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {slab.rate}%
                    </div>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full ${isActive ? "bg-primary/30" : "bg-muted"}`}>
                        <div
                          className={`h-2 rounded-full transition-all ${
                            slab.rate === 0 ? "bg-green-500" : "bg-primary"
                          }`}
                          style={{ width: isActive ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                    <div className="w-32 text-sm text-muted-foreground text-right">
                      {slab.max === Number.POSITIVE_INFINITY
                        ? `Above ₹${(slab.min / 100000).toFixed(0)}L`
                        : `₹${(slab.min / 100000).toFixed(0)}L - ₹${(slab.max / 100000).toFixed(0)}L`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Personalized Tips */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Tips for You
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {getTips().map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Change Income
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1">
              GST Calculator <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: GST Calculator */}
      {step === 3 && (
        <div className="space-y-6">
          {/* GST Calculator */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              GST Calculator
            </h4>
            <p className="text-sm text-muted-foreground mb-6">Find out how much GST is included in your purchase</p>

            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <Label className="text-sm mb-2 block">Total Amount (including GST)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={gstAmount || ""}
                    onChange={(e) => setGstAmount(Number(e.target.value))}
                    placeholder="Enter bill amount"
                    className="pl-8 h-12 text-lg"
                  />
                </div>
              </div>

              {/* GST Rate Selection */}
              <div>
                <Label className="text-sm mb-2 block">GST Rate</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setGstRate(rate)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        gstRate === rate
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:border-primary"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              {gstAmount > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-primary/5 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                    <p className="text-2xl font-bold">₹{gstCalculation.basePrice.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">GST Amount</p>
                    <p className="text-2xl font-bold text-primary">₹{gstCalculation.gstValue.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GST Rates Guide */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              GST Rates Guide
            </h4>
            <div className="space-y-3">
              {GST_CATEGORIES.map((cat, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                  <div
                    className={`w-14 text-center py-2 rounded-lg font-bold ${
                      cat.rate === 0
                        ? "bg-green-500/20 text-green-500"
                        : cat.rate === 5
                          ? "bg-blue-500/20 text-blue-500"
                          : cat.rate === 12
                            ? "bg-yellow-500/20 text-yellow-500"
                            : cat.rate === 18
                              ? "bg-orange-500/20 text-orange-500"
                              : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {cat.rate}%
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.items}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GST Tips */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              GST for Business Owners
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <ShoppingBag className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Registration:</strong> Mandatory if turnover exceeds Rs.40L (Rs.20L for services)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Receipt className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Input Credit:</strong> Claim GST paid on purchases against GST collected on sales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Calculator className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Filing:</strong> File GSTR-1 (sales) by 11th and GSTR-3B (summary) by 20th monthly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Percent className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Composition Scheme:</strong> Pay 1-6% flat tax if turnover under Rs.1.5Cr
                </span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <Button variant="outline" onClick={() => setStep(1)} className="w-full">
            Start Over
          </Button>
        </div>
      )}
    </div>
  )
}
