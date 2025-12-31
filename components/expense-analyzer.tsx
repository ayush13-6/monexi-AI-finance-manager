"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileSpreadsheet,
  RefreshCw,
  Utensils,
  Home,
  Car,
  Plane,
  CreditCard,
  ShoppingBag,
  Smartphone,
  Zap,
  Heart,
  GraduationCap,
  Briefcase,
  Coffee,
  Film,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

// Category configuration with icons and colors
const CATEGORIES = {
  food: {
    label: "Food & Dining",
    icon: Utensils,
    color: "#22c55e",
    keywords: [
      "swiggy",
      "zomato",
      "restaurant",
      "food",
      "cafe",
      "coffee",
      "dominos",
      "pizza",
      "mcdonalds",
      "kfc",
      "starbucks",
    ],
  },
  rent: {
    label: "Rent & Housing",
    icon: Home,
    color: "#3b82f6",
    keywords: ["rent", "housing", "apartment", "flat", "maintenance", "society", "landlord"],
  },
  transport: {
    label: "Transport",
    icon: Car,
    color: "#f59e0b",
    keywords: [
      "uber",
      "ola",
      "rapido",
      "petrol",
      "diesel",
      "fuel",
      "metro",
      "bus",
      "train",
      "irctc",
      "taxi",
      "parking",
    ],
  },
  travel: {
    label: "Travel",
    icon: Plane,
    color: "#8b5cf6",
    keywords: ["makemytrip", "goibibo", "booking", "airbnb", "hotel", "flight", "indigo", "spicejet", "vistara"],
  },
  subscriptions: {
    label: "Subscriptions",
    icon: CreditCard,
    color: "#ec4899",
    keywords: ["netflix", "spotify", "amazon prime", "hotstar", "youtube", "apple", "google play", "subscription"],
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    color: "#06b6d4",
    keywords: ["amazon", "flipkart", "myntra", "ajio", "nykaa", "shopping", "mall", "store", "retail"],
  },
  mobile: {
    label: "Mobile & Internet",
    icon: Smartphone,
    color: "#84cc16",
    keywords: ["jio", "airtel", "vodafone", "vi", "bsnl", "mobile", "recharge", "internet", "wifi", "broadband"],
  },
  utilities: {
    label: "Utilities",
    icon: Zap,
    color: "#f97316",
    keywords: ["electricity", "water", "gas", "bill", "utility", "tata power", "adani", "bescom"],
  },
  health: {
    label: "Health",
    icon: Heart,
    color: "#ef4444",
    keywords: ["hospital", "doctor", "pharmacy", "medical", "medicine", "apollo", "medplus", "1mg", "pharmeasy"],
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    color: "#6366f1",
    keywords: ["school", "college", "course", "udemy", "coursera", "book", "tuition", "coaching"],
  },
  investments: {
    label: "Investments",
    icon: Briefcase,
    color: "#10b981",
    keywords: ["mutual fund", "sip", "stock", "zerodha", "groww", "upstox", "investment", "fd", "rd"],
  },
  entertainment: {
    label: "Entertainment",
    icon: Film,
    color: "#a855f7",
    keywords: ["movie", "pvr", "inox", "cinema", "game", "concert", "event", "bookmyshow"],
  },
  fitness: {
    label: "Fitness",
    icon: Dumbbell,
    color: "#14b8a6",
    keywords: ["gym", "fitness", "cult", "yoga", "sports", "decathlon"],
  },
  other: {
    label: "Other",
    icon: Coffee,
    color: "#64748b",
    keywords: [],
  },
}

type CategoryKey = keyof typeof CATEGORIES

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: CategoryKey
  type: "debit" | "credit"
}

// Auto-categorize based on keywords
function categorizeTransaction(description: string): CategoryKey {
  const lowerDesc = description.toLowerCase()
  for (const [category, config] of Object.entries(CATEGORIES)) {
    if (config.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category as CategoryKey
    }
  }
  return "other"
}

// Parse CSV content
function parseCSV(content: string): Transaction[] {
  const lines = content.split("\n").filter((line) => line.trim())
  const transactions: Transaction[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/"/g, ""))
    if (cols.length >= 3) {
      const amount = Math.abs(Number.parseFloat(cols[2]?.replace(/[^0-9.-]/g, "") || "0"))
      if (amount > 0) {
        const desc = cols[1] || "Unknown"
        transactions.push({
          id: `tx-${i}`,
          date: cols[0] || new Date().toLocaleDateString(),
          description: desc,
          amount,
          category: categorizeTransaction(desc),
          type: amount < 0 || desc.toLowerCase().includes("credit") ? "credit" : "debit",
        })
      }
    }
  }
  return transactions
}

// Sample data for demo
function generateSampleData(): Transaction[] {
  return [
    { id: "1", date: "2024-01-15", description: "Swiggy Order", amount: 450, category: "food", type: "debit" },
    { id: "2", date: "2024-01-14", description: "Rent Payment", amount: 25000, category: "rent", type: "debit" },
    { id: "3", date: "2024-01-13", description: "Uber Ride", amount: 280, category: "transport", type: "debit" },
    {
      id: "4",
      date: "2024-01-12",
      description: "Netflix Subscription",
      amount: 649,
      category: "subscriptions",
      type: "debit",
    },
    { id: "5", date: "2024-01-11", description: "Amazon Shopping", amount: 2500, category: "shopping", type: "debit" },
    { id: "6", date: "2024-01-10", description: "Jio Recharge", amount: 399, category: "mobile", type: "debit" },
    {
      id: "7",
      date: "2024-01-09",
      description: "Electricity Bill",
      amount: 1800,
      category: "utilities",
      type: "debit",
    },
    { id: "8", date: "2024-01-08", description: "Apollo Pharmacy", amount: 650, category: "health", type: "debit" },
    { id: "9", date: "2024-01-07", description: "Groww SIP", amount: 5000, category: "investments", type: "debit" },
    { id: "10", date: "2024-01-06", description: "PVR Movies", amount: 800, category: "entertainment", type: "debit" },
    { id: "11", date: "2024-01-05", description: "Cult Fitness", amount: 1500, category: "fitness", type: "debit" },
    { id: "12", date: "2024-01-04", description: "Zomato Order", amount: 380, category: "food", type: "debit" },
    { id: "13", date: "2024-01-03", description: "Salary Credit", amount: 75000, category: "other", type: "credit" },
  ]
}

export default function ExpenseAnalyzer() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setFileName(file.name)

    try {
      if (file.name.endsWith(".csv")) {
        const text = await file.text()
        const parsed = parseCSV(text)
        if (parsed.length === 0) {
          setError("No valid transactions found in CSV")
        } else {
          setTransactions(parsed)
        }
      } else if (file.name.endsWith(".pdf")) {
        setError(
          "PDF parsing requires server-side processing. Please use CSV for now, or click 'Load Sample Data' to see a demo.",
        )
      } else {
        setError("Please upload a CSV file")
      }
    } catch {
      setError("Error processing file. Please check the format.")
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const loadSampleData = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setTransactions(generateSampleData())
      setFileName("sample_data.csv")
      setIsProcessing(false)
    }, 500)
  }

  const updateCategory = (id: string, newCategory: CategoryKey) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, category: newCategory } : t)))
  }

  const clearData = () => {
    setTransactions([])
    setFileName(null)
    setError(null)
  }

  // Calculate stats
  const expenses = transactions.filter((t) => t.type === "debit")
  const income = transactions.filter((t) => t.type === "credit")
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)

  // Category breakdown
  const categoryData = Object.entries(CATEGORIES)
    .map(([key, config]) => ({
      name: config.label,
      value: expenses.filter((t) => t.category === key).reduce((sum, t) => sum + t.amount, 0),
      color: config.color,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  // No data - show upload UI
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium">Processing...</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Bank Statement</h3>
              <p className="text-muted-foreground mb-6">Drag and drop your CSV bank statement here</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <label className="cursor-pointer">
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                    <FileSpreadsheet className="h-4 w-4" />
                    Select CSV File
                  </div>
                </label>
              </div>

              <Button variant="outline" onClick={loadSampleData} className="mt-2 bg-transparent">
                Load Sample Data
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4">CSV format: Date, Description, Amount</p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Show analysis
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="font-medium">{fileName}</span>
          <span className="text-muted-foreground">({transactions.length} transactions)</span>
        </div>
        <Button variant="outline" size="sm" onClick={clearData}>
          Clear & Upload New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">-Rs.{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-primary">+Rs.{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Net Savings</p>
          <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-primary" : "text-red-500"}`}>
            Rs.{(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Savings Rate</p>
          <p className="text-2xl font-bold">
            {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="font-semibold mb-4">Expense Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rs.${value.toLocaleString()}`} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="font-semibold mb-4">Top Categories</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData.slice(0, 5)} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `Rs.${value.toLocaleString()}`} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {categoryData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <h4 className="font-semibold mb-4">Transactions</h4>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {transactions.slice(0, 20).map((tx) => {
            const CategoryIcon = CATEGORIES[tx.category].icon
            return (
              <div key={tx.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${CATEGORIES[tx.category].color}20` }}>
                  <CategoryIcon className="h-4 w-4" style={{ color: CATEGORIES[tx.category].color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <Select value={tx.category} onValueChange={(v) => updateCategory(tx.id, v as CategoryKey)}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={`font-semibold ${tx.type === "credit" ? "text-primary" : "text-red-500"}`}>
                  {tx.type === "credit" ? "+" : "-"}Rs.{tx.amount.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
