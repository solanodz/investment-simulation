"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { getCoinPriceHistory } from "@/lib/api"
import { CryptoSelector } from "@/components/CryptoSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Info, Calculator, Loader2, LineChart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { InvestmentResults } from "@/components/InvestmentResults"

// Definition of available time periods
const TIME_PERIODS = [
    { label: "1 month", value: "1m", days: 30 },
    { label: "3 months", value: "3m", days: 90 },
    { label: "6 months", value: "6m", days: 180 },
    { label: "1 year", value: "1y", days: 365 },
    { label: "2 years", value: "2y", days: 730 },
    { label: "5 years", value: "5y", days: 1825 },
    { label: "Maximum", value: "max", days: null },
]

export function InvestmentCalculator() {
    const [selectedCoin, setSelectedCoin] = useState(null)
    const [amount, setAmount] = useState("")
    const [period, setPeriod] = useState("1y") // Default period: 1 year
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [dataWarning, setDataWarning] = useState(null)
    const [graphVisible, setGraphVisible] = useState(true) // Control chart visibility
    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    // Handler for period change
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        // When period changes, we only hide the chart
        if (result) {
            setGraphVisible(false);
        }
    };

    const handleCalculate = async () => {
        if (!selectedCoin || !amount) {
            setError("Please select a cryptocurrency and an investment amount")
            return
        }

        setLoading(true)
        setError(null)
        setDataWarning(null)

        try {
            // Calculate dates based on selected period
            const toTimestamp = Date.now()
            let fromTimestamp

            if (period === "max") {
                // For "maximum", we use a very old date
                fromTimestamp = new Date("2010-01-01").getTime()
            } else {
                // Find the selected period
                const selectedPeriod = TIME_PERIODS.find(p => p.value === period)
                const days = selectedPeriod ? selectedPeriod.days : 365 // Default 1 year

                // Calculate start date
                fromTimestamp = toTimestamp - (days * 24 * 60 * 60 * 1000)
            }

            console.log(`Fetching data from ${new Date(fromTimestamp).toISOString()} to ${new Date(toTimestamp).toISOString()}`)

            // Get price history
            const response = await getCoinPriceHistory(
                selectedCoin,
                "usd",
                Math.floor(fromTimestamp / 1000),
                Math.floor(toTimestamp / 1000)
            )

            // Check if the API indicated that we requested data older than available
            if (response.requestedTooEarly && response.earliestDataPoint) {
                const requestedDate = new Date(fromTimestamp).toLocaleDateString('en', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                setDataWarning({
                    requestedDate,
                    earliestDate: response.earliestDataPoint.formattedDate,
                    coinName: selectedCoin.toUpperCase()
                });
            }

            // Calculate investment performance
            if (response && response.prices && response.prices.length >= 2) {
                console.log(`Received ${response.prices.length} data points`);

                const initialPrice = response.prices[0][1]
                const currentPrice = response.prices[response.prices.length - 1][1]
                const initialInvestment = parseFloat(amount)
                const currentValue = (currentPrice / initialPrice) * initialInvestment
                const profit = currentValue - initialInvestment
                const profitPercentage = ((currentValue / initialInvestment) - 1) * 100

                // Format data for the chart
                const chartData = response.prices.map(([timestamp, price]) => ({
                    date: new Date(timestamp).toLocaleDateString(),
                    price: price,
                    investment: (price / initialPrice) * initialInvestment
                }))

                // Reduce the number of points if there are too many for visualization
                let sampledChartData = chartData
                if (chartData.length > 100) {
                    const step = Math.ceil(chartData.length / 100)

                    // Always include first and last points
                    const firstPoint = chartData[0]
                    const lastPoint = chartData[chartData.length - 1]

                    sampledChartData = [firstPoint]

                    // Add intermediate points
                    for (let i = step; i < chartData.length - step; i += step) {
                        sampledChartData.push(chartData[i])
                    }

                    // Add the last point if it's not the same as the first
                    if (chartData.length > 1) {
                        sampledChartData.push(lastPoint)
                    }
                }

                const actualStartDate = new Date(response.prices[0][0]);
                const actualEndDate = new Date(response.prices[response.prices.length - 1][0]);

                setResult({
                    initialInvestment,
                    currentValue,
                    profit,
                    profitPercentage,
                    coinId: selectedCoin,
                    chartData: sampledChartData,
                    startDate: actualStartDate.toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    endDate: actualEndDate.toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    periodLabel: TIME_PERIODS.find(p => p.value === period)?.label || "Custom"
                });

                // Make the chart visible
                setGraphVisible(true);
            } else {
                setError("Couldn't get enough price data for the selected period")
            }
        } catch (err) {
            console.error("Calculation error:", err)
            setError("Error calculating investment performance: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    // Handlers for input changes
    const handleCoinChange = (coin) => {
        setSelectedCoin(coin);
        if (result) {
            setGraphVisible(false);
        }
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        if (result) {
            setGraphVisible(false);
        }
    };

    // Function to render results in the portal
    const ResultsPortal = () => {
        if (!isBrowser) return null

        const container = document.getElementById("results-container")
        if (!container) return null

        if (!result) {
            // Show card with instructional message when there are no results
            return createPortal(
                <Card className="border-border/50 shadow-sm overflow-hidden mt-4">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg font-medium">Investment Simulation</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Complete the form above and click "Calculate" to see results
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <LineChart className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                        <p className="text-sm text-muted-foreground max-w-md">
                            Here you will see how much your investment would have grown if you had invested in the selected cryptocurrency during the specified time period.
                        </p>
                    </CardContent>
                </Card>,
                container
            )
        }

        return createPortal(
            <InvestmentResults
                result={result}
                dataWarning={dataWarning}
                graphVisible={graphVisible}
            />,
            container
        )
    }

    return (
        <>
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardContent className="pt-5 space-y-5">
                    <CryptoSelector onSelect={handleCoinChange} />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-xs sm:text-sm font-medium">
                                Investment Amount (USD)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                inputMode="decimal"
                                min="1"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="100"
                                className="bg-transparent h-9 sm:h-10 text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="period" className="text-xs sm:text-sm font-medium">
                                Time Period
                            </Label>
                            <Select
                                value={period}
                                onValueChange={handlePeriodChange}
                            >
                                <SelectTrigger className="bg-transparent h-9 sm:h-10 text-sm">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_PERIODS.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="py-2 px-3 text-xs sm:text-sm">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="flex-col items-stretch">
                    <Button
                        onClick={handleCalculate}
                        disabled={loading || !selectedCoin || !amount}
                        className="ml-auto flex items-center gap-2 text-xs sm:text-sm h-8 sm:h-10"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                <span>Calculating...</span>
                            </>
                        ) : (
                            <>
                                <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Calculate</span>
                            </>
                        )}
                    </Button>

                    {/* Disclaimer about "Maximum" adapted to the style and with dark/light mode support */}
                    {period === "max" && (
                        <div className="w-full mt-4 rounded-md bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-3 text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
                            <div>
                                When selecting &quot;Maximum&quot;, only data available in the Binance API will be displayed.
                                This may not coincide with the actual launch date of the cryptocurrency.
                                Available historical data varies by cryptocurrency and depends on when it was listed on the exchange.
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <ResultsPortal />
        </>
    )
}