"use client"

import { useState } from "react"

const TAX_RATE = 0.3 // 30% tax on Robux earnings

export function RobuxCalculator() {
  const [mode, setMode] = useState<"before" | "after">("before")
  const [inputValue, setInputValue] = useState("")

  const calculateResult = () => {
    const num = parseFloat(inputValue) || 0
    if (num < 0) return 0

    if (mode === "before") {
      // Robux before tax -> calculate after tax
      return Math.floor(num * (1 - TAX_RATE))
    } else {
      // Robux after tax -> calculate before tax
      return Math.ceil(num / (1 - TAX_RATE))
    }
  }

  const result = calculateResult()
  const displayResult = result.toLocaleString()
  const formattedInput = inputValue
    ? parseFloat(inputValue).toLocaleString()
    : "0"

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="mt-8 mb-2 font-heading text-4xl leading-tight font-bold text-foreground sm:text-5xl lg:text-5xl">
            Robux Tax Calculator
          </h1>
          <p className="text-sm text-muted-foreground sm:text-lg">
            Instantly calculate how much Robux you'll receive or need after
            Roblox's 30% marketplace fee.
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg sm:p-10">
          {/* Mode Toggle */}
          <div className="mb-10 flex gap-3 rounded-lg bg-muted p-1 sm:gap-4">
            <button
              onClick={() => {
                setMode("before")
                setInputValue("")
              }}
              className={`flex-1 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 sm:py-4 sm:text-base ${
                mode === "before"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Before Tax (Gross)
            </button>
            <button
              onClick={() => {
                setMode("after")
                setInputValue("")
              }}
              className={`flex-1 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 sm:py-4 sm:text-base ${
                mode === "after"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              After Tax (Net)
            </button>
          </div>

          {/* Input Section */}
          <div className="mb-10">
            <div className="relative">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-muted-foreground">
                ⏣
              </div>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value
                  // Allow only non-negative numbers
                  if (val === "" || parseFloat(val) >= 0) {
                    setInputValue(val)
                  }
                }}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-border bg-background py-4 pr-4 pl-12 text-base font-medium text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none sm:py-5 sm:text-lg"
              />
            </div>
          </div>

          {/* Result Section */}
          <div className="rounded-lg bg-muted p-8 sm:p-10">
            <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              You will receive
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-light text-foreground sm:text-4xl lg:text-5xl">
                ⏣ {displayResult} Robux
              </span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
              {mode === "before"
                ? `This is ${formattedInput} × ${(1 - TAX_RATE).toFixed(1)} (After Roblox's 30% marketplace fee.)`
                : `This is ${formattedInput} ÷ ${(1 - TAX_RATE).toFixed(1)} (Before Roblox's 30% marketplace fee.)`}
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-10 border-t border-border pt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-heading text-sm font-semibold text-foreground">
                  Tax Rate
                </h3>
                <p className="text-sm text-muted-foreground">
                  30% applied to all Robux earnings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
