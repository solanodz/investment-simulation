import { NextResponse } from 'next/server';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

// Current price fallback data (used when API fails)
const currentPriceFallbacks = {
    'BTC': 42000,
    'ETH': 2400,
    'BNB': 550,
    'XRP': 0.5,
    'ADA': 0.4,
    'SOL': 150,
    'DOGE': 0.08,
    'DOT': 6,
    'LTC': 75,
    'LINK': 8
};

/**
 * GET handler for /api/binance/price endpoint
 * Fetches current price for a specific cryptocurrency
 */
export async function GET(request) {
    try {
        // Get query params
        const { searchParams } = new URL(request.url);
        const coinId = searchParams.get('coinId')?.toUpperCase();

        if (!coinId) {
            return NextResponse.json({
                success: false,
                error: 'Missing required parameter: coinId'
            }, { status: 400 });
        }

        // Format symbol for Binance - add USDT if not already present
        const symbol = coinId.endsWith('USDT') ? coinId : `${coinId}USDT`;

        // Fetch price from Binance
        const response = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=${symbol}`);

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Format response to match our API format
        const price = parseFloat(data.price);
        const result = {};
        result[coinId.toLowerCase()] = { usd: price };

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching price from Binance:', error);

        // Extract coinId from query params for fallback
        const { searchParams } = new URL(request.url);
        const coinId = searchParams.get('coinId')?.toUpperCase();

        // Return fallback price
        const symbol = coinId.replace('USDT', '');
        const fallbackPrice = currentPriceFallbacks[symbol] || 100;
        const result = {};
        result[coinId.toLowerCase()] = { usd: fallbackPrice };

        return NextResponse.json({
            success: false,
            error: error.message,
            data: result,
            isSimulated: true
        }, { status: 200 });
    }
} 