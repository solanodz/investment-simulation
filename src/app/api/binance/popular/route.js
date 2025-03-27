import { NextResponse } from 'next/server';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

/**
 * GET handler for /api/binance/popular endpoint
 * Fetches popular cryptocurrency data from Binance
 */
export async function GET(request) {
    try {
        // Get top 100 cryptocurrencies from Binance (based on 24h volume)
        const response = await fetch(`${BINANCE_API_URL}/ticker/24hr`);

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
        }

        const allPairs = await response.json();

        // Filter out only USDT pairs, which are most popular
        const usdtPairs = allPairs.filter(pair =>
            pair.symbol.endsWith('USDT') &&
            !pair.symbol.includes('UP') &&
            !pair.symbol.includes('DOWN') &&
            !pair.symbol.includes('BEAR') &&
            !pair.symbol.includes('BULL')
        );

        // Sort by volume (descending)
        const sortedPairs = usdtPairs.sort((a, b) =>
            parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
        );

        // Transform to our app's format
        const result = sortedPairs.slice(0, 50).map(pair => {
            const symbol = pair.symbol.replace('USDT', '');
            return {
                id: symbol.toLowerCase(),
                symbol: symbol.toLowerCase(),
                name: symbol,
                current_price: parseFloat(pair.lastPrice),
                price_change_percentage_24h: parseFloat(pair.priceChangePercent),
                market_cap: parseFloat(pair.quoteVolume), // Using volume as approximation
                volume_24h: parseFloat(pair.volume),
                image: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`
            };
        });

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching popular coins from Binance:', error);

        // Return fallback data 
        return NextResponse.json({
            success: false,
            error: error.message,
            data: getHardcodedPopularCoins()
        }, { status: 200 });
    }
}

/**
 * Hard-coded popular coins as fallback
 */
function getHardcodedPopularCoins() {
    return [
        {
            id: "bitcoin",
            symbol: "btc",
            name: "BTC",
            current_price: 42000,
            price_change_percentage_24h: 2.5,
            market_cap: 800000000,
            volume_24h: 25000000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png"
        },
        {
            id: "ethereum",
            symbol: "eth",
            name: "ETH",
            current_price: 2400,
            price_change_percentage_24h: 1.8,
            market_cap: 300000000,
            volume_24h: 15000000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png"
        },
        {
            id: "binancecoin",
            symbol: "bnb",
            name: "BNB",
            current_price: 550,
            price_change_percentage_24h: 0.5,
            market_cap: 90000000,
            volume_24h: 5000000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png"
        },
        {
            id: "ripple",
            symbol: "xrp",
            name: "XRP",
            current_price: 0.5,
            price_change_percentage_24h: 0.2,
            market_cap: 25000000,
            volume_24h: 1500000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png"
        },
        {
            id: "cardano",
            symbol: "ada",
            name: "ADA",
            current_price: 0.4,
            price_change_percentage_24h: -0.5,
            market_cap: 15000000,
            volume_24h: 1000000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png"
        },
        {
            id: "solana",
            symbol: "sol",
            name: "SOL",
            current_price: 150,
            price_change_percentage_24h: 3.2,
            market_cap: 60000000,
            volume_24h: 3000000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png"
        },
        {
            id: "dogecoin",
            symbol: "doge",
            name: "DOGE",
            current_price: 0.08,
            price_change_percentage_24h: 1.1,
            market_cap: 11000000,
            volume_24h: 900000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png"
        },
        {
            id: "polkadot",
            symbol: "dot",
            name: "DOT",
            current_price: 6,
            price_change_percentage_24h: 0.3,
            market_cap: 7000000,
            volume_24h: 500000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dot.png"
        },
        {
            id: "litecoin",
            symbol: "ltc",
            name: "LTC",
            current_price: 75,
            price_change_percentage_24h: 0.9,
            market_cap: 5500000,
            volume_24h: 400000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png"
        },
        {
            id: "chainlink",
            symbol: "link",
            name: "LINK",
            current_price: 8,
            price_change_percentage_24h: 1.5,
            market_cap: 4000000,
            volume_24h: 300000,
            image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png"
        }
    ];
} 