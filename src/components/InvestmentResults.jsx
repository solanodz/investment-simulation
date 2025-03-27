"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function InvestmentResults({ result, dataWarning, graphVisible = true }) {
    if (!result) return null

    return (
        <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <CardTitle className="text-base font-medium">Investment Results</CardTitle>
                        <CardDescription className="text-xs">
                            {result.startDate} → {result.endDate}
                        </CardDescription>
                    </div>

                    {dataWarning && (
                        <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 py-1 text-xs whitespace-nowrap">
                            <Info className="h-3 w-3 mr-1" />
                            Data from {dataWarning.earliestDate}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-4 py-3 flex-grow">
                <div className="grid grid-cols-4 gap-2">
                    <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-[10px] text-muted-foreground">Initial</p>
                        <p className="text-sm font-semibold truncate">${result.initialInvestment.toFixed(2)}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-[10px] text-muted-foreground">Current</p>
                        <p className="text-sm font-semibold truncate">${result.currentValue.toFixed(2)}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-[10px] text-muted-foreground">Profit/Loss</p>
                        <p className={`text-sm font-semibold truncate ${result.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            ${result.profit.toFixed(2)}
                        </p>
                    </div>

                    <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-[10px] text-muted-foreground">Return</p>
                        <p className={`text-sm font-semibold truncate flex items-center ${result.profitPercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {result.profitPercentage.toFixed(2)}%
                            {result.profitPercentage >= 0 ?
                                <TrendingUp className="h-3 w-3 ml-1" /> :
                                <TrendingDown className="h-3 w-3 ml-1" />
                            }
                        </p>
                    </div>
                </div>

                {/* Area chart with gradient - only visible when graphVisible is true */}
                <div className="h-64 sm:h-80 w-full">
                    {graphVisible ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={result.chartData}
                                margin={{
                                    left: 0,
                                    right: 8,
                                    top: 12,
                                    bottom: 12
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={10}
                                    interval="preserveStartEnd"
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                                    width={40}
                                    fontSize={10}
                                    tick={{ fontSize: 10 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        padding: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value, name) => {
                                        return [`$${value.toFixed(2)}`, name === 'price' ? 'Asset Value' : 'My Investment'];
                                    }}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={0.4}
                                    fill="url(#colorPrice)"
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    name="price"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="investment"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fillOpacity={0.4}
                                    fill="url(#colorInvestment)"
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    name="investment"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                            <div className="text-muted-foreground text-xs">
                                Click &quot;Calculate&quot; to update the chart
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className={cn(
                "border-t px-4 py-2 flex items-center justify-between",
                result.profit >= 0
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
            )}>
                <div className="grid gap-2 w-full">
                    <div className={cn(
                        "flex items-center gap-2 font-medium leading-none text-xs sm:text-sm",
                        result.profit >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {result.profit >= 0 ? (
                            <>
                                Your investment has grown by {result.profitPercentage.toFixed(2)}%
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            </>
                        ) : (
                            <>
                                Your investment has decreased by {Math.abs(result.profitPercentage).toFixed(2)}%
                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground text-[10px] sm:text-xs">
                        From {result.startDate} to {result.endDate}
                    </div>
                </div>

                {dataWarning && (
                    <p className="text-[10px] sm:text-xs text-amber-500/90 ml-auto pt-1">
                        <Info className="h-3 w-3 inline mr-1" />
                        Data available from {dataWarning.earliestDate}
                    </p>
                )}
            </CardFooter>
        </Card>
    )
}