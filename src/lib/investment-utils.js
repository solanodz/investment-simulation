/**
 * Calculate investment returns based on price data
 * @param {number} initialAmount - Initial investment amount in USD
 * @param {number} initialPrice - Price of the asset at time of investment
 * @param {number} currentPrice - Current price of the asset
 * @returns {Object} Investment metrics
 */
export function calculateInvestmentReturns(initialAmount, initialPrice, currentPrice) {
    const currentValue = (currentPrice / initialPrice) * initialAmount;
    const profit = currentValue - initialAmount;
    const profitPercentage = ((currentValue / initialAmount) - 1) * 100;

    return {
        initialAmount,
        currentValue,
        profit,
        profitPercentage
    };
}

/**
 * Format price data for charts
 * @param {Array} priceData - Array of price data points from CoinGecko
 * @param {number} sampleSize - Number of data points to include in the chart
 * @returns {Array} Formatted data for charts
 */
export function formatChartData(priceData, sampleSize = 50) {
    if (!priceData || !priceData.prices || priceData.prices.length === 0) {
        return [];
    }

    // Format all data points
    const chartData = priceData.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: price
    }));

    // Take a sample of data points for better chart performance
    const step = Math.max(1, Math.floor(chartData.length / sampleSize));
    return chartData.filter((_, i) => i % step === 0);
}

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(value);
}

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value / 100);
} 