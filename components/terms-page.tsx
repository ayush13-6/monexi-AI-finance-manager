"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Shield, AlertTriangle, Scale, Clock, Mail } from "lucide-react"

export function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-accent mb-4">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6 md:p-8">
          <ScrollArea className="h-auto">
            <div className="space-y-8 text-foreground">
              {/* Introduction */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>
                    By accessing and using Monexi (&quot;the Service&quot;), you acknowledge that you have read,
                    understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part
                    of these terms, you must not use our Service.
                  </p>
                  <p>
                    Monexi provides personal finance management tools, including budgeting features, investment
                    calculators, market data visualization, and AI-powered financial guidance. These services are
                    intended for informational and educational purposes only.
                  </p>
                </div>
              </section>

              {/* Financial Disclaimer */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">2. Financial Disclaimer</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="font-medium text-destructive mb-2">Important Notice:</p>
                    <p>
                      Monexi does NOT provide financial, investment, tax, or legal advice. All information,
                      calculations, and AI-generated suggestions are for educational and informational purposes only and
                      should not be construed as professional financial advice.
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Not a Financial Advisor:</strong> Monexi is not registered as a financial advisor, broker,
                      or investment consultant with SEBI (Securities and Exchange Board of India) or any other
                      regulatory authority.
                    </li>
                    <li>
                      <strong>Investment Risks:</strong> All investments carry risk, including potential loss of
                      principal. Past performance does not guarantee future results. Stock prices, mutual fund NAVs, and
                      market data displayed may be delayed or indicative.
                    </li>
                    <li>
                      <strong>Professional Advice Required:</strong> Before making any financial decisions, you should
                      consult with a qualified financial advisor, tax consultant, or legal professional who can assess
                      your individual circumstances.
                    </li>
                    <li>
                      <strong>AI Limitations:</strong> Our AI advisor provides general guidance based on publicly
                      available information. It cannot account for your complete financial situation, risk tolerance, or
                      personal goals.
                    </li>
                  </ul>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">3. User Responsibilities</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>As a user of Monexi, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide accurate information when using our calculators and tools</li>
                    <li>Use the Service for lawful purposes only</li>
                    <li>Not rely solely on Monexi for financial decisions</li>
                    <li>Verify all calculations and data independently before acting</li>
                    <li>Keep your account credentials (if applicable) secure and confidential</li>
                    <li>Not attempt to reverse engineer, hack, or compromise the Service</li>
                    <li>Not use the Service to generate misleading or fraudulent financial advice</li>
                  </ul>
                </div>
              </section>

              {/* Data & Privacy */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">4. Data Privacy & Security</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>Your privacy is important to us:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Local Processing:</strong> Financial calculations are performed locally in your browser.
                      We do not store your income, expenses, or investment details on our servers unless you explicitly
                      create an account.
                    </li>
                    <li>
                      <strong>AI Conversations:</strong> Conversations with Monexi AI may be processed through
                      third-party AI services (Google Gemini). While we don&apos;t permanently store these
                      conversations, they may be temporarily processed for response generation.
                    </li>
                    <li>
                      <strong>Market Data:</strong> Stock prices and market information are sourced from third-party
                      providers and are subject to their respective terms of service.
                    </li>
                    <li>
                      <strong>No Sensitive Data:</strong> Never enter sensitive information like bank account numbers,
                      PAN details, Aadhaar numbers, or passwords into any Monexi tool or AI chat.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Monexi and its creators shall not be liable for any direct, indirect, incidental, consequential,
                      or punitive damages arising from your use of the Service.
                    </li>
                    <li>
                      We are not responsible for any financial losses incurred based on information, calculations, or
                      suggestions provided by Monexi.
                    </li>
                    <li>
                      We make no warranties regarding the accuracy, completeness, or reliability of market data,
                      calculations, or AI-generated content.
                    </li>
                    <li>The Service is provided &quot;as is&quot; without any warranties, express or implied.</li>
                  </ul>
                </div>
              </section>

              {/* Service Modifications */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">6. Service Availability & Modifications</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      We reserve the right to modify, suspend, or discontinue any part of the Service at any time
                      without prior notice.
                    </li>
                    <li>
                      Market data features depend on third-party APIs and may be unavailable during API outages or rate
                      limits.
                    </li>
                    <li>
                      These Terms may be updated periodically. Continued use of the Service after changes constitutes
                      acceptance of the modified terms.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">7. Governing Law</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                    arising from these Terms or your use of Monexi shall be subject to the exclusive jurisdiction of the
                    courts in India.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">8. Contact Us</h2>
                </div>
                <div className="space-y-3 text-muted-foreground pl-8">
                  <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <p>
                      <strong>Email:</strong> contact@monexi.in
                    </p>
                    <p>
                      <strong>Address:</strong> India
                    </p>
                  </div>
                </div>
              </section>

              {/* Acknowledgment */}
              <section className="border-t border-border pt-6">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm">
                    By using Monexi, you acknowledge that you have read and understood these Terms and Conditions,
                    including the financial disclaimer. You agree that Monexi is a tool for educational purposes and
                    that all financial decisions remain your sole responsibility.
                  </p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
