"use client"

import { useState, useEffect } from "react"
import { getPopularCoins, getHardcodedPopularCoins } from "@/lib/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function CryptoSelector({ onSelect }) {
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [usingFallback, setUsingFallback] = useState(false)

    const loadCoins = async () => {
        try {
            setLoading(true)
            setError(null)
            setUsingFallback(false)

            // Try to fetch popular coins from API
            try {
                // Fetch popular coins sorted by market cap
                const data = await getPopularCoins(50, 1) // Get top 50 coins by market cap

                if (!data || !Array.isArray(data)) {
                    throw new Error("Invalid API response format")
                }

                setCoins(data)
            } catch (apiError) {
                console.error("API fetch failed, using hardcoded coins:", apiError)

                // Use hardcoded popular coins as fallback
                setCoins(getHardcodedPopularCoins())
                setUsingFallback(true)
            }
        } catch (err) {
            console.error("Failed to load coins:", err)
            setError("Failed to load cryptocurrencies. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCoins()
    }, [])

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                <div className="flex items-center gap-2">
                    {usingFallback && (
                        <span className="text-xs text-amber-500 dark:text-amber-400">
                            Using offline data
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadCoins}
                        disabled={loading}
                        className="h-8 px-2 text-xs"
                    >
                        <RefreshCw className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            <Select
                disabled={loading}
                onValueChange={onSelect}
            >
                <SelectTrigger id="crypto-select" className="w-full">
                    <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                    {error ? (
                        <SelectItem value="error" disabled>{error}</SelectItem>
                    ) : loading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : coins.length === 0 ? (
                        <SelectItem value="empty" disabled>No cryptocurrencies found</SelectItem>
                    ) : (
                        coins.map((coin) => (
                            <SelectItem key={coin.id} value={coin.id}>
                                <div className="flex items-center">
                                    {coin.image && (
                                        <img
                                            src={coin.image}
                                            alt={coin.name}
                                            className="w-5 h-5 mr-2"
                                        />
                                    )}
                                    {coin.name} ({coin.symbol.toUpperCase()})
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    )
} 