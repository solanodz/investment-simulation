import { Footer } from "@/components/Footer"
import { Calculator, TrendingUp, Clock, Wallet, ChartLine, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function About() {
    return (
        <div className="flex flex-col min-h-screen">


            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Hero section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Investment Simulator</Badge>
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Educational Tool
                            </Badge>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight">About Crypto Investment Simulator</h1>

                        <p className="text-lg text-muted-foreground">
                            A tool designed to visualize the impact of long-term investment strategies in cryptocurrency markets.
                        </p>
                        <p className="text-sm text-amber-500 dark:text-amber-400 font-semibold max-w-2xl">
                            This is not financial advice. This tool was created to help you understand the power of long-term investment strategies in the cryptocurrency market.
                        </p>
                        <Separator className="my-6" />
                    </section>

                    {/* Project description */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold tracking-tight">Project Overview</h2>

                        <p className="text-muted-foreground dark:text-stone-300">
                            This application was created to help regular people like <Link href="https://solanodz.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300">me</Link> (not a financial or crypto expert) understand the power of long-term investment strategies in the cryptocurrency market.
                            By simulating historical investments, users can visualize how the majority of the crypto market has grown over time and not just from a day to another.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mt-8">
                            <Card className="border-border/50 shadow-sm bg-stone-50 dark:bg-stone-800/50 dark:border-stone-700/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Calculator className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                        Investment Simulation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 text-sm text-muted-foreground dark:text-stone-300">
                                    Select any cryptocurrency, input your hypothetical investment amount,
                                    and choose a time period to see how your investment would have performed.
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm bg-stone-50 dark:bg-stone-800/50 dark:border-stone-700/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <ChartLine className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                        Visual Analytics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 text-sm text-muted-foreground dark:text-stone-300">
                                    View detailed charts showing the growth trajectory of your investment
                                    compared to the price movement of the selected cryptocurrency.
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Long-term investment philosophy */}
                    <section className="space-y-6 rounded-xl">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            The Power of Long-Term Investing
                        </h2>

                        <div className="space-y-4">
                            <p className="text-muted-foreground dark:text-stone-300">
                                Cryptocurrency markets are known for their volatility. Daily price fluctuations can be dramatic,
                                leading many investors to make emotional decisions based on short-term market movements.
                            </p>

                            <p className="text-muted-foreground dark:text-stone-300">
                                However, historical data shows that a patient, long-term approach often yields better results.
                                By zooming out and looking at multi-year timeframes, we can observe powerful growth trends
                                that short-term traders might miss.
                            </p>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>
                                        While past performance doesn&apos;t guarantee future results, this simulator helps visualize
                                        how a &quot;buy and hold&quot; strategy might have performed across different market cycles.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* NEW SECTION: Time Horizon Impact */}
                    <section className="space-y-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/20 dark:from-amber-700/10 dark:to-emerald-700/10 p-6 border border-border/50 dark:border-stone-700/50">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            The Longer You Hold, The Better Your Odds
                        </h2>

                        <div className="space-y-4">
                            <p className="text-muted-foreground dark:text-stone-300">
                                One of the most powerful insights you can get from this simulator is seeing how investment timeframes
                                dramatically impact outcomes. You can try it yourself - run multiple simulations with the same cryptocurrency
                                but with increasing time horizons.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 my-6">
                                <div className="rounded-lg bg-white/50 dark:bg-black/20 p-4 border border-border/50 text-center">
                                    <p className="text-sm font-medium mb-1">Short-Term (1-6 months)</p>
                                    <p className="text-xs text-muted-foreground">
                                        High volatility, unpredictable outcomes, heavily influenced by market sentiment
                                    </p>
                                </div>

                                <div className="rounded-lg bg-white/50 dark:bg-black/20 p-4 border border-border/50 text-center">
                                    <p className="text-sm font-medium mb-1">Medium-Term (1-2 years)</p>
                                    <p className="text-xs text-muted-foreground">
                                        Moderate volatility, early trend recognition, influenced by market cycles
                                    </p>
                                </div>

                                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 border border-emerald-200 dark:border-emerald-800/30 text-center">
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Long-Term (3+ years)</p>
                                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                                        Reduced volatility impact, higher probability of positive returns, benefits from fundamental growth
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground dark:text-stone-300">
                                Historical data across most established cryptocurrencies will show that the longer your investment timeframe,
                                the higher your probability of positive returns in most cases. This is because short-term market noise gets filtered out,
                                and the underlying adoption and utility growth becomes the dominant price driver.
                            </p>


                        </div>
                    </section>

                    {/* Investment principles */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold tracking-tight">Key Investment Principles</h2>

                        <div className="grid sm:grid-cols-3 gap-6">
                            <Card className="border-border/50 shadow-sm dark:bg-stone-800/50 dark:border-stone-700/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium">Time in the Market</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 text-sm text-muted-foreground dark:text-stone-300">
                                    Rather than trying to time market entries and exits perfectly,
                                    long-term investors benefit from extended exposure to market growth.
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm dark:bg-stone-800/50 dark:border-stone-700/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium">Volatility Smoothing</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 text-sm text-muted-foreground dark:text-stone-300">
                                    Short-term market fluctuations tend to smooth out over longer time horizons,
                                    potentially reducing investment risk.
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm dark:bg-stone-800/50 dark:border-stone-700/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-medium">Compound Growth</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2 text-sm text-muted-foreground dark:text-stone-300">
                                    Long-term holding allows investors to benefit from the potential
                                    compounding effect of cryptocurrency appreciation.
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section className="rounded-lg border border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/20 p-4 text-amber-600 dark:text-amber-400 text-sm">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 shrink-0" />
                            <div className="space-y-2">
                                <p className="font-medium">Investment Disclaimer</p>
                                <p className="text-xs">
                                    This tool is for educational purposes only. Cryptocurrency investments involve substantial risk.
                                    Historical performance does not guarantee future results. Always conduct your own research and
                                    consider consulting a financial advisor before making investment decisions.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Call to action */}
                    <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/25 dark:from-emerald-900/20 dark:to-emerald-900/40 border border-emerald-500/20 dark:border-emerald-800/30 rounded-lg p-6 text-center space-y-4">
                        <h2 className="text-xl font-semibold dark:text-white">Explore your potential returns</h2>
                        <p className="text-muted-foreground dark:text-stone-300 max-w-2xl mx-auto">
                            Return to the simulator and discover how your investment could have performed
                            across different cryptocurrencies and time periods.
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-emerald-700 to-emerald-500 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-700 text-white font-medium text-sm mt-2 transition-all duration-300"
                        >
                            <Calculator className="h-4 w-4" />
                            Try the Simulator
                        </a>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}   