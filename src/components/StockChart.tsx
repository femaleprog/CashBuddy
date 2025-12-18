import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type StockData } from '../types/stockTypes';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StockChartProps {
    sp500: StockData;
    nasdaq: StockData;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

const TIME_RANGES: { label: string; value: TimeRange; days: number }[] = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '1Y', value: '1Y', days: 365 },
];

export const StockChart: React.FC<StockChartProps> = ({ sp500, nasdaq }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');

    // Filter data based on time range
    const chartData = useMemo(() => {
        const selectedRange = TIME_RANGES.find(r => r.value === timeRange);
        const days = selectedRange?.days || 30;

        const sp500Data = sp500.prices.slice(-days);
        const nasdaqData = nasdaq.prices.slice(-days);

        return sp500Data.map((sp, index) => ({
            timestamp: sp.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sp500: sp.price,
            nasdaq: nasdaqData[index]?.price || 0,
        }));
    }, [sp500, nasdaq, timeRange]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="modern-card p-3">
                    <p className="text-section-title mb-2">{payload[0].payload.timestamp}</p>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted">S&P 500:</span>
                            <span className="text-body font-semibold">${payload[0].value.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted">NASDAQ:</span>
                            <span className="text-body font-semibold">${payload[1].value.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="modern-card h-[420px] flex flex-col">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                {/* Title + Legend */}
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-section-title">Stock Prices</h3>
                        <p className="text-tiny">Live market data</p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-400" />
                            <span className="text-tiny">S&P 500</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                            <span className="text-tiny">NASDAQ</span>
                        </div>
                    </div>
                </div>

                {/* Symbol Chips */}
                <div className="flex items-center gap-3">
                    <div className="pill">
                        <span className="text-cyan-400 font-semibold">SPX</span>
                        <span className="text-body font-semibold">${sp500.currentPrice.toFixed(2)}</span>
                        <span className={`flex items-center gap-1 text-tiny font-semibold ${sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {sp500.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {sp500.changePercent.toFixed(2)}%
                        </span>
                    </div>
                    <div className="pill">
                        <span className="text-pink-400 font-semibold">IXIC</span>
                        <span className="text-body font-semibold">${nasdaq.currentPrice.toFixed(2)}</span>
                        <span className={`flex items-center gap-1 text-tiny font-semibold ${nasdaq.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {nasdaq.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {nasdaq.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Time Range Pills */}
            <div className="flex gap-2 mb-4">
                {TIME_RANGES.map(range => (
                    <button
                        key={range.value}
                        onClick={() => setTimeRange(range.value)}
                        className={`pill ${timeRange === range.value ? 'active' : ''}`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <motion.div
                className="flex-1 min-h-0"
                key={timeRange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="timestamp"
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            domain={['dataMin - 100', 'dataMax + 100']}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="sp500"
                            stroke="#22d3ee"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={600}
                        />

                        <Line
                            type="monotone"
                            dataKey="nasdaq"
                            stroke="#ec4899"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={600}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};
