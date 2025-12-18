import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './ui/Card';
import { type SimulationResult } from '../types';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface TimelineProps {
    data: SimulationResult[];
}

type TimeRange = '1Y' | '3Y' | '5Y' | 'All';

const TIME_RANGES: { label: string; value: TimeRange; years: number }[] = [
    { label: '1Y', value: '1Y', years: 1 },
    { label: '3Y', value: '3Y', years: 3 },
    { label: '5Y', value: '5Y', years: 5 },
    { label: 'All', value: 'All', years: 50 },
];

export const Timeline: React.FC<TimelineProps> = ({ data }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('All');

    // Filter data based on time range
    const filteredData = data.filter((_, index) => {
        const selectedRange = TIME_RANGES.find(r => r.value === timeRange);
        return selectedRange ? index < selectedRange.years : true;
    });

    // Mock forecast data extension
    const forecastData = filteredData.map(d => ({
        ...d,
        upperBound: d.netWorth * 1.2,
        lowerBound: d.netWorth * 0.8,
    }));

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/95 backdrop-blur-xl border border-primary/40 rounded-xl p-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                    <p className="text-white font-bold mb-2">Age {data.age}</p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Net Worth:</span>
                            <span className="text-primary font-semibold">€{data.netWorth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Range:</span>
                            <span className="text-cyan-400 text-xs">€{data.lowerBound.toLocaleString()} - €{data.upperBound.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <Card className="h-[450px] w-full p-6 flex flex-col bg-card/30 backdrop-blur-md border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.1)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-5 h-5 text-primary animate-pulse" />
                        <h3 className="text-xl font-bold text-white tracking-wide">Volatility Forecast</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Projected impact of new tech regulations</p>
                </div>

                {/* Enhanced Legend */}
                <div className="flex gap-4 bg-black/30 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" />
                        <span className="text-xs font-medium text-cyan-100">Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(236,72,153,1)]" />
                        <span className="text-xs font-medium text-pink-100">Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 rounded-full bg-primary/30" />
                        <span className="text-xs font-medium text-purple-200">Range</span>
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-1 mb-4 bg-black/20 p-1 rounded-lg border border-white/5 w-fit">
                {TIME_RANGES.map(range => (
                    <button
                        key={range.value}
                        onClick={() => setTimeRange(range.value)}
                        className={cn(
                            "px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 relative",
                            timeRange === range.value
                                ? "bg-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                    >
                        {timeRange === range.value && (
                            <motion.div
                                layoutId="activeRange"
                                className="absolute inset-0 bg-primary rounded-md -z-10"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        {range.label}
                    </button>
                ))}
            </div>

            <motion.div
                className="flex-1 w-full min-h-0 z-10"
                key={timeRange}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={forecastData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="age"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                            label={{ value: 'Net Worth', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Confidence Interval Area */}
                        <Area
                            type="monotone"
                            dataKey="upperBound"
                            stroke="transparent"
                            fill="url(#colorForecast)"
                            animationDuration={800}
                        />

                        {/* Baseline Line */}
                        <Area
                            type="monotone"
                            dataKey="lowerBound"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fill="url(#colorBaseline)"
                            animationDuration={800}
                        />

                        {/* Main Forecast Line */}
                        <Area
                            type="monotone"
                            dataKey="netWorth"
                            stroke="#ec4899"
                            strokeWidth={3}
                            fill="transparent"
                            filter="drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))"
                            animationDuration={800}
                        />

                        {timeRange === 'All' && (
                            <ReferenceLine
                                x={35}
                                stroke="rgba(255,255,255,0.2)"
                                strokeDasharray="3 3"
                                label={{
                                    value: "Tech Regulation",
                                    fill: "rgba(255,255,255,0.5)",
                                    fontSize: 10,
                                    position: 'top'
                                }}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </Card>
    );
};
