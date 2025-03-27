/**
 * API Client for crypto data
 * Uses Binance API via local API routes to avoid CORS issues
 */

/**
 * Fetch from internal API with error handling
 */
async function fetchAPI(endpoint, params = {}) {
    try {
        // Build query string from params
        const queryParams = new URLSearchParams(params).toString();
        const url = `/api/binance${endpoint}${queryParams ? `?${queryParams}` : ''}`;

        const response = await fetch(url);
        const result = await response.json();

        // If our API returned an error but with fallback data
        if (!result.success && result.data) {
            console.warn(`API warning: ${result.error}`);
            return result.data;
        }

        // If our API failed completely
        if (!result.success) {
            throw new Error(result.error || 'Unknown API error');
        }

        return result.data;
    } catch (error) {
        console.error('API Client Error:', error);
        throw error;
    }
}

/**
 * Common API functions
 */

// Get list of supported coins - fallback to popular coins
export async function getCoins() {
    try {
        // Use popular coins as a substitute since we don't have a local endpoint for all coins
        return await getPopularCoins(100, 1);
    } catch (error) {
        console.error('Failed to get coins list:', error);
        return getHardcodedPopularCoins();
    }
}

// Get popular coins by market cap
export async function getPopularCoins(perPage = 50, page = 1) {
    try {
        return await fetchAPI('/popular', { per_page: perPage, page });
    } catch (error) {
        console.warn('API fetch failed, using hardcoded coins:', error);
        return getHardcodedPopularCoins();
    }
}

// Hard-coded popular coins as fallback
export function getHardcodedPopularCoins() {
    return [
        {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png"
        },
        {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png"
        },
        {
            id: "tether",
            symbol: "usdt",
            name: "Tether",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
        },
        {
            id: "binancecoin",
            symbol: "bnb",
            name: "BNB",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png"
        },
        {
            id: "ripple",
            symbol: "xrp",
            name: "XRP",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png"
        },
        {
            id: "cardano",
            symbol: "ada",
            name: "Cardano",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png"
        },
        {
            id: "solana",
            symbol: "sol",
            name: "Solana",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png"
        },
        {
            id: "dogecoin",
            symbol: "doge",
            name: "Dogecoin",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png"
        },
        {
            id: "polkadot",
            symbol: "dot",
            name: "Polkadot",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dot.png"
        },
        {
            id: "litecoin",
            symbol: "ltc",
            name: "Litecoin",
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png"
        }
    ];
}

// Get historical data for a coin on a specific date
export async function getCoinHistoricalData(coinId, date) {
    try {
        return await fetchAPI('/historical', { coinId, date });
    } catch (error) {
        console.warn(`Could not fetch historical data: ${error.message}`);
        throw error;
    }
}

// Get coin price data for a specific date range
export async function getCoinPriceHistory(coinId, currency = 'usd', from, to) {
    try {
        // Convert coinId to use as symbol for Binance
        const symbol = coinId.toLowerCase().replace('coin', '');

        // Calcular duración del rango en días (esto nos ayudará a depurar)
        const rangeDays = Math.floor((to - from) / (24 * 60 * 60));
        console.log(`Requesting price history for ${symbol} over ${rangeDays} days`);

        const result = await fetchAPI('/price-history', {
            symbol,
            startTime: from, // Already in seconds
            endTime: to // Already in seconds
        });

        // Si la API devuelve información sobre el punto de datos más antiguo, pasarlo
        if (result && result.earliestDataPoint) {
            return {
                ...result.data,
                requestedTooEarly: result.requestedTooEarly,
                earliestDataPoint: result.earliestDataPoint
            };
        }

        return result;
    } catch (error) {
        console.warn(`Could not fetch price history: ${error.message}`);
        throw error;
    }
}

// Get current price data for a coin
export async function getCoinCurrentPrice(coinId, currency = 'usd') {
    try {
        return await fetchAPI('/price', { coinId });
    } catch (error) {
        console.warn(`Could not fetch current price: ${error.message}`);
        throw error;
    }
}

// Get detailed information about a coin - not implemented
export async function getCoinDetails(coinId) {
    // For now, just return a simplified object with the coin ID
    return {
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId.substring(0, 3),
    };
} 