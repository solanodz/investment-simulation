"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPopularCoins, getHardcodedPopularCoins } from "@/lib/api"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export function ApiTestButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [usingFallback, setUsingFallback] = useState(false)

    const testApiConnection = async () => {
        setIsLoading(true)
        setError(null)
        setResult(null)
        setUsingFallback(false)

        try {
            // Try API call with a small sample size
            const response = await getPopularCoins(3, 1)

            if (!response || !Array.isArray(response)) {
                throw new Error("Invalid API response format")
            }

            // Format results to display
            setResult({
                success: true,
                data: response.map(coin => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    current_price: coin.current_price,
                    price_change_percentage_24h: coin.price_change_percentage_24h,
                    volume_24h: coin.volume_24h
                }))
            })
        } catch (err) {
            console.error("API Test Error:", err)

            // Check for different types of errors
            if (err.message && err.message.includes("429")) {
                setError("API Rate Limited: Too many requests. Wait a minute and try again.")
            } else if (err.message && err.message.includes("CORS")) {
                setError("CORS Error: The app is now using server-side API routes to avoid CORS restrictions.")
            } else if (err.message && err.message.includes("fetch")) {
                setError("Network Error: Could not connect to the API. Check your internet connection.")
            } else {
                setError(err.message || "Something went wrong connecting to the Binance API")
            }

            // Show fallback data
            try {
                const fallbackData = getHardcodedPopularCoins()
                setResult({
                    success: false,
                    data: fallbackData.slice(0, 3)
                })
                setUsingFallback(true)
            } catch (fallbackErr) {
                console.error("Fallback error:", fallbackErr)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Button
                onClick={testApiConnection}
                disabled={isLoading}
                variant="outline"
            >
                {isLoading ? "Testing API..." : "Test Binance API Connection"}
            </Button>

            {error && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
                    <CardHeader className="pb-2 flex flex-row items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-amber-700 dark:text-amber-400">API Warning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-amber-700 dark:text-amber-400">
                            {error}
                        </CardDescription>
                    </CardContent>
                    {usingFallback && (
                        <CardFooter className="pt-0">
                            <p className="text-xs text-amber-600 dark:text-amber-500">
                                Using offline data for top cryptocurrencies. App will still work with limited functionality.
                            </p>
                        </CardFooter>
                    )}
                </Card>
            )}

            {result && (
                <Card className={usingFallback ? "border-amber-200" : "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900"}>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2">
                        {usingFallback ? (
                            <Info className="h-5 w-5 text-amber-500" />
                        ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        <CardTitle className={usingFallback ? "text-amber-700" : "text-green-700 dark:text-green-400"}>
                            {usingFallback ? "Using Fallback Data" : "API Connected Successfully"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-2">
                            {usingFallback
                                ? "Fallback cryptocurrency data (offline mode):"
                                : "Top cryptocurrencies by volume:"}
                        </p>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <CardDescription>
                            {usingFallback
                                ? "The app is using pre-defined cryptocurrency data. This ensures functionality even when external APIs are unavailable."
                                : "Your Binance API connection is working correctly via server-side routes."}
                        </CardDescription>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
} 