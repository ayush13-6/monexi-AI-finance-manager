"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I start planning my budget?",
    answer:
      "Simply go to the Dashboard, enter your monthly income and expenses. Monexi will automatically calculate your savings and suggest a personalized budget plan based on your risk profile.",
  },
  {
    question: "Is Monexi secure?",
    answer:
      "Yes, Monexi is built with a privacy-first approach. Your financial data is processed locally in your browser session, ensuring maximum privacy and security.",
  },
  {
    question: "Can I track real-time stock prices?",
    answer:
      "Use the 'Live Market' tool in the Tools section to get real-time stock prices and interactive charts for Indian equities from NSE and BSE.",
  },
  {
    question: "What is the AI Advisor?",
    answer:
      "The AI Advisor is powered by advanced AI. It acts as your personal financial assistant, answering queries about investments, savings strategies, and financial concepts.",
  },
  {
    question: "Is Monexi free to use?",
    answer:
      "Yes, Monexi is completely free to use for all your personal finance tracking and planning needs. No hidden fees, no premium tiers.",
  },
]

export function FaqSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently asked
            <br />
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about Monexi.</p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass rounded-xl px-6 border-none">
              <AccordionTrigger className="text-foreground hover:no-underline py-6 text-left">
                <span className="font-medium text-base md:text-lg">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
