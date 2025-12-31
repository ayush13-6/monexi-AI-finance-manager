import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Aapki API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export async function POST(req: Request) {
  try {
    const { goalName, goalPrice, monthlySavings } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // 👇 UPDATED PROMPT: More English, Less Hinglish
    const prompt = `
      You are Monexi AI, a smart and polite financial advisor for Indian users. 🇮🇳
      
      User wants to buy: "${goalName}"
      Price: ₹${goalPrice}
      User's Monthly Savings: ₹${monthlySavings}

      Your Task:
      Give 2 short sentences of advice.
      
      Tone Rules:
      1. Speak primarily in **English**.
      2. You can use **1 or 2 Hindi words** only for a friendly touch (e.g., "Sahi decision hai", "Thoda wait karein").
      3. Do NOT use full Hinglish sentences like "Arre yaar". Be professional but warm.
      4. Be direct: Is it a 'Need' or 'Want'? Should they buy now or invest?

      Example Output:
      "This looks like a 'Want', not a need. Since it's expensive, I suggest investing in a Liquid Fund first—sahi time par khareedna behtar hoga! 📉"
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();

    return NextResponse.json({ advice: responseText });

  } catch (error) {
    console.error("Monexi AI Error:", error);
    return NextResponse.json({ advice: "AI is thinking... please try again." }, { status: 500 });
  }
}