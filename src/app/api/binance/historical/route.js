import { NextResponse } from 'next/server';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

// Hardcoded historical price data for common cryptocurrencies
// Values are average prices in USD for different timeframes
const historicalPriceData = {
    'BTC': {
        "2023": {
            "01": 23000,
            "02": 24500,
            "03": 28000,
            "04": 29000,
            "05": 27000,
            "06": 30000,
            "07": 29500,
            "08": 28000,
            "09": 26500,
            "10": 28000,
            "11": 35000,
            "12": 42000
        },
        "2022": {
            "01": 37000,
            "02": 39000,
            "03": 42000,
            "04": 40000,
            "05": 30000,
            "06": 20000,
            "07": 23000,
            "08": 20000,
            "09": 19000,
            "10": 19500,
            "11": 16500,
            "12": 17000
        },
        "2021": {
            "01": 35000,
            "02": 45000,
            "03": 55000,
            "04": 58000,
            "05": 37000,
            "06": 33000,
            "07": 35000,
            "08": 45000,
            "09": 43000,
            "10": 60000,
            "11": 58000,
            "12": 47000
        },
        "2020": {
            "01": 8000,
            "02": 9500,
            "03": 6500,
            "04": 7000,
            "05": 9000,
            "06": 9500,
            "07": 11000,
            "08": 11500,
            "09": 10500,
            "10": 13000,
            "11": 18000,
            "12": 23000
        }
    },
    'ETH': {
        "2023": {
            "01": 1600,
            "02": 1650,
            "03": 1750,
            "04": 1900,
            "05": 1850,
            "06": 1900,
            "07": 1850,
            "08": 1800,
            "09": 1650,
            "10": 1600,
            "11": 2050,
            "12": 2400
        },
        "2022": {
            "01": 2800,
            "02": 2700,
            "03": 3000,
            "04": 3200,
            "05": 2200,
            "06": 1200,
            "07": 1300,
            "08": 1600,
            "09": 1350,
            "10": 1300,
            "11": 1200,
            "12": 1250
        },
        "2021": {
            "01": 1400,
            "02": 1800,
            "03": 1900,
            "04": 2200,
            "05": 2800,
            "06": 2200,
            "07": 2100,
            "08": 3200,
            "09": 3000,
            "10": 4000,
            "11": 4400,
            "12": 3800
        },
        "2020": {
            "01": 140,
            "02": 230,
            "03": 130,
            "04": 190,
            "05": 210,
            "06": 240,
            "07": 280,
            "08": 400,
            "09": 350,
            "10": 380,
            "11": 580,
            "12": 730
        }
    }
};

/**
 * GET handler for /api/binance/historical endpoint
 * Fetches historical data for a specific coin on a specific date
 * 
 * Note: Binance API doesn't directly support querying for a specific date in the past
 * We'll need to get the closest candle data and adjust our approach
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const coinId = searchParams.get('coinId')?.toUpperCase();
        const date = searchParams.get('date');

        if (!coinId || !date) {
            return NextResponse.json({
                success: false,
                error: 'Missing required parameters: coinId and date'
            }, { status: 400 });
        }

        const dateObj = new Date(date);
        const today = new Date();

        // Si es una fecha antigua, usamos datos históricos
        if (dateObj < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
            return NextResponse.json({
                success: true,
                data: generateHistoricalDataSeries(coinId, dateObj, today),
                isSimulated: true
            });
        }

        // Para datos recientes, usamos la API de Binance
        const symbol = coinId.endsWith('USDT') ? coinId : `${coinId}USDT`;

        const params = new URLSearchParams();
        params.append('symbol', symbol);
        params.append('interval', '1M'); // Intervalo mensual
        params.append('startTime', dateObj.getTime());
        params.append('endTime', today.getTime());

        const response = await fetch(`${BINANCE_API_URL}/klines?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if we got valid data
        if (!data || data.length === 0) {
            console.warn(`No data found for ${symbol} on ${date}, using fallback data`);
            return NextResponse.json({
                success: false,
                error: 'No data found for the specified date',
                data: generateHistoricalDataFallback(coinId, date),
                isSimulated: true
            }, { status: 200 });
        }

        // Extract the close price from the candle data
        // Binance klines format: [openTime, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignore]
        const closePrice = parseFloat(data[0][4]);

        // Format the response to match our expected format
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

        // Base symbol without USDT
        const baseSymbol = coinId.replace('USDT', '');

        const result = {
            id: coinId.toLowerCase(),
            name: baseSymbol,
            symbol: baseSymbol.toLowerCase(),
            market_data: {
                current_price: {
                    usd: closePrice
                }
            },
            date: formattedDate
        };

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching historical data from Binance:', error);

        // Extract params for fallback
        const { searchParams } = new URL(request.url);
        const coinId = searchParams.get('coinId')?.toUpperCase();
        const date = searchParams.get('date');

        // Return fallback data
        return NextResponse.json({
            success: false,
            error: error.message,
            data: generateHistoricalDataFallback(coinId, date),
            isSimulated: true
        }, { status: 200 });
    }
}

/**
 * Helper function to generate mock historical data when API fails
 */
function generateHistoricalDataFallback(coinId, dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Base symbol without USDT
    const baseSymbol = coinId.replace('USDT', '');

    // Check if we have data for this coin
    const coinData = historicalPriceData[baseSymbol] || historicalPriceData.BTC;

    // Check if we have data for this year
    if (!coinData[year]) {
        // Use most recent year's data
        const years = Object.keys(coinData).sort();
        const mostRecentYear = years[years.length - 1];
        console.log(`No data for ${year}, using ${mostRecentYear} instead`);

        // Use approximate price (adjust based on market trends)
        const priceMultiplier = year > mostRecentYear ? 1.2 : 0.8; // Simple approximation
        const basePrice = coinData[mostRecentYear][month] || coinData[mostRecentYear]["01"];
        const estimatedPrice = basePrice * priceMultiplier;

        return {
            id: coinId.toLowerCase(),
            name: baseSymbol,
            symbol: baseSymbol.toLowerCase(),
            market_data: {
                current_price: {
                    usd: estimatedPrice
                }
            },
            date: `${day}-${month}-${year}`,
            isSimulated: true
        };
    }

    // Get price for the month, or use first month if not available
    const price = coinData[year][month] || coinData[year]["01"];

    return {
        id: coinId.toLowerCase(),
        name: baseSymbol,
        symbol: baseSymbol.toLowerCase(),
        market_data: {
            current_price: {
                usd: price
            }
        },
        date: `${day}-${month}-${year}`,
        isSimulated: true
    };
}

/**
 * Genera una serie histórica de precios desde la fecha inicial hasta hoy
 */
function generateHistoricalDataSeries(coinId, startDate, endDate) {
    const baseSymbol = coinId.replace('USDT', '');
    const coinData = historicalPriceData[baseSymbol] || historicalPriceData.BTC;
    const pricesSeries = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        let price;
        if (coinData[year] && coinData[year][month]) {
            price = coinData[year][month];
        } else {
            // Usar el último precio conocido o hacer una estimación
            const lastKnownYear = Object.keys(coinData).sort().pop();
            price = coinData[lastKnownYear][month] * (year > lastKnownYear ? 1.2 : 0.8);
        }

        pricesSeries.push({
            date: `${day}-${month}-${year}`,
            price: price
        });

        // Avanzar al siguiente mes
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
        id: coinId.toLowerCase(),
        name: baseSymbol,
        symbol: baseSymbol.toLowerCase(),
        price_series: pricesSeries,
        isSimulated: true
    };
} 