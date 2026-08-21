"use client"

import { useState, useEffect, useRef } from "react"

const DEFAULT_TAX_RATE = 30 // default/placeholder tax rate in percent

export default function RobuxCalculator() {
  const [mode, setMode] = useState("before")
  const [inputValue, setInputValue] = useState("")

  // Tax rate is now dynamic (in percent), user-configurable via drawer
  const [taxRatePercent, setTaxRatePercent] = useState(DEFAULT_TAX_RATE)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [rateDraft, setRateDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (drawerOpen) {
      // focus the rate input shortly after the drawer animates in
      const t = setTimeout(() => inputRef.current?.focus(), 250)
      return () => clearTimeout(t)
    }
  }, [drawerOpen])

  const confirmRate = () => {
    const parsed = parseFloat(rateDraft)
    const valid = !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100
    setTaxRatePercent(valid ? parsed : DEFAULT_TAX_RATE)
    setDrawerOpen(false)
  }

  const taxRate = taxRatePercent / 100

  const calculateResult = () => {
    const num = parseFloat(inputValue) || 0
    if (num < 0) return 0

    if (mode === "before") {
      return Math.floor(num * (1 - taxRate))
    } else {
      return Math.ceil(num / (1 - taxRate))
    }
  }

  const result = calculateResult()
  const displayResult = result.toLocaleString()
  const formattedInput = inputValue
    ? parseFloat(inputValue).toLocaleString()
    : "0"
  const netFactor = (1 - taxRate).toFixed(taxRate % 0.01 === 0 ? 2 : 4)

  return (
    // "dark" forces the shadcn dark-theme CSS variables as the default here.
    // Remove this class (or make it conditional) if you want to respect the
    // user's / app's own theme provider instead of always-dark.
    <div className="dark">
      <div className="relative flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-12 text-center sm:mb-16">
            <h1 className="mt-8 mb-2 font-heading text-4xl leading-tight font-bold text-foreground sm:text-5xl lg:text-5xl">
              Robux Tax Calculator
            </h1>
            <p className="text-sm text-muted-foreground sm:text-lg">
              Instantly calculate how much Robux you'll receive or need after
              Roblox's marketplace fee.
            </p>
            <button
              onClick={() => {
                setRateDraft(String(taxRatePercent))
                setDrawerOpen(true)
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Tax rate: {taxRatePercent}%<span aria-hidden="true">✎</span>
            </button>
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
                  ? `This is ${formattedInput} × ${netFactor} (After ${taxRatePercent}% marketplace fee.)`
                  : `This is ${formattedInput} ÷ ${netFactor} (Before ${taxRatePercent}% marketplace fee.)`}
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
                    {taxRatePercent}% applied to all Robux earnings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div
          onClick={() => confirmRate()}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        />

        {/* Drawer */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tax-rate-drawer-title"
          className={`fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-border bg-popover shadow-2xl transition-transform duration-300 ease-out sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-4 sm:mx-auto sm:max-w-md sm:rounded-2xl sm:border ${
            drawerOpen
              ? "translate-y-0"
              : "translate-y-full sm:translate-y-[120%]"
          }`}
        >
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-muted sm:hidden" />

          <div className="flex flex-col gap-1 p-6 pb-2">
            <h2
              id="tax-rate-drawer-title"
              className="font-heading text-lg font-semibold text-popover-foreground"
            >
              Set the marketplace tax rate
            </h2>
            <p className="text-sm text-muted-foreground">
              Roblox's fee can change. Enter the current rate, or leave this as
              the default ({DEFAULT_TAX_RATE}%) if you're not sure.
            </p>
          </div>

          <div className="px-6 py-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={rateDraft}
                onChange={(e) => setRateDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmRate()}
                placeholder={`${DEFAULT_TAX_RATE}`}
                className="w-full rounded-lg border border-border bg-background py-4 pr-10 pl-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-muted-foreground">
                %
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Default: {DEFAULT_TAX_RATE}%. If you click OK without typing
              anything, {DEFAULT_TAX_RATE}% will be used.
            </p>
          </div>

          <div className="flex gap-3 p-6 pt-2">
            <button
              onClick={() => {
                setRateDraft(String(DEFAULT_TAX_RATE))
              }}
              className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Use default
            </button>
            <button
              onClick={confirmRate}
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
