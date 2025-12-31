import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { pdfData } = await req.json()
    
    // 1. Setup Gemini Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: { responseMimeType: "application/json" } 
    })

    // 2. The "Auditor" Prompt (Tone Controlled & Accuracy Focused)
    const prompt = `
    You are Monexi's Financial Auditor. Analyze this bank statement PDF.
    
    --- 1. DATA EXTRACTION (Priority High) ---
    - Search for the "Statement Summary" or "Account Summary" block (usually last page).
    - EXTRACT EXACT VALUES for:
      - 'total_spent' (Debits/Withdrawals)
      - 'total_income' (Credits/Deposits)
    - If you cannot find the summary table, sum up the transactions you see.

    --- 2. CATEGORIZATION ---
    - Identify spending in: Food, Travel, Bills, Shopping, UPI/Transfers.
    - Sum them up approximately.

    --- 3. INSIGHTS (Tone: Professional & Advisory) ---
    - DO NOT use words like "Suspicious", "Worth checking", or "Fraud".
    - DO use words like "High transaction volume", "Frequent transfers", "Recurring expense".
    - Insight 1: Spending vs Income observation.
    - Insight 2: Largest category observation.
    - Insight 3: A practical money-saving tip.

    --- 4. LATEST TRANSACTIONS ---
    - Return only the top 5 most recent transactions.

    OUTPUT JSON STRUCTURE:
    {
      "summary": {
        "total_spent": 0.00,
        "total_income": 0.00,
        "savings_rate": 0.0,
        "risk_score": "Low/Medium/High"
      },
      "categories": [
        { "name": "Food & Dining", "amount": 0, "color": "#F59E0B" },
        { "name": "Travel & Commute", "amount": 0, "color": "#3B82F6" },
        { "name": "Shopping", "amount": 0, "color": "#EC4899" },
        { "name": "Bills & Utilities", "amount": 0, "color": "#10B981" },
        { "name": "UPI & Transfers", "amount": 0, "color": "#8B5CF6" }
      ],
      "insights": ["Insight 1", "Insight 2", "Insight 3"],
      "recent_transactions": [
        { "date": "DD/MM", "desc": "Name", "amount": 0, "type": "DEBIT", "category": "Food" }
      ]
    }
    `

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: pdfData, mimeType: "application/pdf" } },
    ])

    const responseText = result.response.text()
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    const data = JSON.parse(cleanedText)

    // --- 🧮 JAVASCRIPT MATH LAYER (The "Perfect Graph" Fix) ---
    // 1. Calculate Real Savings Rate
    const income = data.summary.total_income || 1;
    const spent = data.summary.total_spent || 0;
    data.summary.savings_rate = ((income - spent) / income) * 100;

    // 2. Balance the Graph (Add "Others" category)
    const categorySum = data.categories.reduce((acc: any, curr: any) => acc + curr.amount, 0);
    
    if (spent > categorySum) {
      const difference = spent - categorySum;
      // Only add if difference is significant (>1% of total)
      if (difference > (spent * 0.01)) {
        data.categories.push({
          name: "Others / Uncategorized",
          amount: parseFloat(difference.toFixed(2)),
          color: "#6B7280"
        });
      }
    }
    // --------------------------------------------------------

    return NextResponse.json({ data })

  } catch (error) {
    console.error("Analysis Error:", error)
    return NextResponse.json({ message: "Analysis failed" }, { status: 500 })
  }
}