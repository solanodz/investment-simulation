import { NextResponse } from 'next/server';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

/**
 * GET handler for /api/binance/price-history endpoint
 * Fetches historical price data from Binance with optimized intervals
 */
export async function GET(request) {
    try {
        // Get query params
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol')?.toUpperCase();
        const requestedStartTime = parseInt(searchParams.get('startTime') || '0') * 1000; // Convert to ms
        const requestedEndTime = parseInt(searchParams.get('endTime') || Date.now().toString()) * 1000; // Convert to ms

        if (!symbol) {
            return NextResponse.json({
                success: false,
                error: 'Missing required parameter: symbol'
            }, { status: 400 });
        }

        // Check if we're running on Vercel production environment
        // This helps avoid API calls that will likely fail
        const isVercelProduction = process.env.VERCEL_ENV === 'production';

        // If on Vercel, skip the actual API call and use simulated data directly
        if (isVercelProduction) {
            console.log('Running on Vercel production, using simulated data instead of Binance API');
            return NextResponse.json({
                success: true,
                data: generateSimulatedPriceHistory(
                    symbol,
                    requestedStartTime,
                    requestedEndTime
                ),
                isSimulated: true
            });
        }

        // Add USDT to symbol if it doesn't already have it
        const fullSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;

        // Determinar el mejor intervalo basado en el rango de tiempo solicitado
        // Esto nos ayudará a optimizar la cantidad de datos que obtenemos
        const timeRange = requestedEndTime - requestedStartTime;
        const dayMs = 24 * 60 * 60 * 1000;
        const yearMs = 365 * dayMs;

        let interval;
        if (timeRange > 5 * yearMs) {
            interval = '1M';  // Intervalo mensual para rangos muy largos (>5 años)
        } else if (timeRange > 2 * yearMs) {
            interval = '1w';  // Intervalo semanal para rangos medianos (2-5 años)
        } else {
            interval = '1d';  // Intervalo diario para rangos cortos (<2 años)
        }

        console.log(`Using interval ${interval} for time range of ${(timeRange / dayMs).toFixed(0)} days`);

        // Build query params
        const params = new URLSearchParams();
        params.append('symbol', fullSymbol);
        params.append('interval', interval);
        params.append('startTime', requestedStartTime.toString());
        params.append('endTime', requestedEndTime.toString());
        params.append('limit', '1000'); // Maximum allowed

        // Fetch data from Binance
        const response = await fetch(`${BINANCE_API_URL}/klines?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if we got valid data
        if (!data || data.length === 0) {
            throw new Error(`No data found for ${symbol} in the specified date range`);
        }

        console.log(`Received ${data.length} data points from Binance API with interval ${interval}`);

        // Transform Binance klines data to our format
        const prices = data.map(candle => {
            return [
                candle[0], // timestamp (openTime)
                parseFloat(candle[4]) // close price
            ];
        });

        const marketCaps = data.map(candle => {
            return [
                candle[0], // timestamp
                parseFloat(candle[7]) // quoteVolume
            ];
        });

        const volumes = data.map(candle => {
            return [
                candle[0], // timestamp
                parseFloat(candle[5]) // volume
            ];
        });

        // Agregar un punto adicional para el momento actual si el último dato es antiguo
        const now = Date.now();
        const lastTimestamp = prices[prices.length - 1][0];
        const timeDifference = now - lastTimestamp;

        if (timeDifference > dayMs) {
            console.log(`Adding current price point (last data was ${(timeDifference / dayMs).toFixed(1)} days old)`);

            try {
                // Obtener el precio actual
                const tickerParams = new URLSearchParams();
                tickerParams.append('symbol', fullSymbol);

                const tickerResponse = await fetch(`${BINANCE_API_URL}/ticker/price?${tickerParams.toString()}`);

                if (tickerResponse.ok) {
                    const tickerData = await tickerResponse.json();
                    const currentPrice = parseFloat(tickerData.price);

                    // Añadir el punto actual
                    prices.push([now, currentPrice]);

                    // Estimar volumen y market cap
                    const lastVolume = volumes[volumes.length - 1][1];
                    const lastMarketCap = marketCaps[marketCaps.length - 1][1];
                    volumes.push([now, lastVolume * (0.9 + Math.random() * 0.2)]);
                    marketCaps.push([now, lastMarketCap * (0.9 + Math.random() * 0.2)]);
                }
            } catch (e) {
                console.warn("Could not add current price point:", e);
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                prices,
                market_caps: marketCaps,
                total_volumes: volumes
            },
            interval: interval,
            dataPoints: prices.length
        });
    } catch (error) {
        console.error('Error fetching price history from Binance:', error);

        // Extraer parámetros para datos simulados
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol') || 'BTC';
        const startTime = parseInt(searchParams.get('startTime') || '0') * 1000;
        const endTime = parseInt(searchParams.get('endTime') || Date.now().toString()) * 1000;

        // Return simulated data if Binance API fails
        return NextResponse.json({
            success: false,
            error: error.message,
            data: generateSimulatedPriceHistory(
                symbol,
                startTime,
                endTime
            ),
            isSimulated: true
        }, { status: 200 });
    }
}

/**
 * Generate simulated price history when API fails
 */
function generateSimulatedPriceHistory(symbol, startTime, endTime) {
    // Reference prices for common coins
    const referencePrices = {
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

    // Get base symbol without USDT
    const baseSymbol = symbol.replace('USDT', '').toUpperCase();

    // Get reference price or use default
    const currentPrice = referencePrices[baseSymbol] || 100;

    // Generate price data points
    const dayMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.ceil((endTime - startTime) / dayMs);
    const dataPoints = Math.min(totalDays, 100); // Limit to 100 data points

    const startPrice = currentPrice * 0.8; // Start 20% lower than current price

    // Generate price data with some randomness
    const prices = [];
    const volumes = [];
    const marketCaps = [];

    for (let i = 0; i < dataPoints; i++) {
        const timestamp = startTime + (i * dayMs);

        // Calculate price with some randomness
        const progress = i / (dataPoints - 1);
        const randomFactor = 0.9 + (Math.random() * 0.2); // Random between 0.9 and 1.1
        const price = startPrice + ((currentPrice - startPrice) * progress * randomFactor);

        prices.push([timestamp, price]);
        volumes.push([timestamp, price * 1000 * randomFactor]); // Simulated volume
        marketCaps.push([timestamp, price * 1000000 * randomFactor]); // Simulated market cap
    }

    return {
        prices,
        market_caps: marketCaps,
        total_volumes: volumes,
        isSimulated: true
    };
} 