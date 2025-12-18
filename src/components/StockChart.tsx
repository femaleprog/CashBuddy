import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type StockData } from '../types/stockTypes';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StockChartProps {
    sp500: StockData;
    nasdaq: StockData;
    scenarioActive?: boolean;
    scenarioType?: 'hedge' | 'reduce' | 'alert';
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

const TIME_RANGES: { label: string; value: TimeRange; days: number }[] = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '1Y', value: '1Y', days: 365 },
];

export const StockChart: React.FC<StockChartProps> = ({ sp500, nasdaq, scenarioActive, scenarioType }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');

    // Filter data based on time range
    const chartData = useMemo(() => {
        const selectedRange = TIME_RANGES.find(r => r.value === timeRange);
        const days = selectedRange?.days || 30;

        const sp500Data = sp500.prices.slice(-days);
        const nasdaqData = nasdaq.prices.slice(-days);

        return sp500Data.map((sp, index) => {
            const base = {
                timestamp: sp.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sp500: sp.price,
                nasdaq: nasdaqData[index]?.price || 0,
            };

            // Add scenario projections if active
            if (scenarioActive) {
                const scenarioMultiplier = scenarioType === 'hedge' ? 0.95 : scenarioType === 'reduce' ? 0.92 : 1.02;
                return {
                    ...base,
                    sp500Scenario: sp.price * scenarioMultiplier,
                    nasdaqScenario: (nasdaqData[index]?.price || 0) * scenarioMultiplier,
                };
            }
            return base;
        });
    }, [sp500, nasdaq, timeRange, scenarioActive, scenarioType]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="modern-card" style={{ padding: '12px' }}>
                    <p className="text-section-title" style={{ marginBottom: '8px' }}>{payload[0].payload.timestamp}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: 'rgba(219,216,227,0.7)', fontSize: '12px' }}>S&P 500:</span>
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>${payload[0].value.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: 'rgba(219,216,227,0.7)', fontSize: '12px' }}>NASDAQ:</span>
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>${payload[1].value.toFixed(2)}</span>
                        </div>
                        {scenarioActive && payload.length > 2 && (
                            <>
                                <div style={{ height: '1px', background: 'rgba(219,216,227,0.1)', margin: '6px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                    <span style={{ color: '#ec4899', fontSize: '12px' }}>Scenario:</span>
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#ec4899' }}>${payload[2]?.value?.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="modern-card" style={{ height: '420px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Scenario Badge */}
            {scenarioActive && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        background: 'rgba(236,72,153,0.15)',
                        border: '1px solid rgba(236,72,153,0.3)',
                        color: '#ec4899',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <div style={{ width: '6px', height: '6px', background: '#ec4899', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                    Scenario: {scenarioType?.toUpperCase()}
                </motion.div>
            )}

            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                        <h3 className="text-section-title">Stock Prices</h3>
                        <p style={{ fontSize: '11px', color: 'rgba(219,216,227,0.5)' }}>Live market data</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#22d3ee' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(219,216,227,0.7)' }}>S&P 500</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#ec4899' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(219,216,227,0.7)' }}>NASDAQ</span>
                        </div>
                        {scenarioActive && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#a855f7', opacity: 0.7 }} />
                                <span style={{ fontSize: '11px', color: '#a855f7' }}>Scenario</span>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="pill">
                        <span style={{ color: '#22d3ee', fontWeight: 600 }}>SPX</span>
                        <span style={{ fontWeight: 600 }}>${sp500.currentPrice.toFixed(2)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: sp500.change >= 0 ? '#4ade80' : '#f87171' }}>
                            {sp500.change >= 0 ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : <TrendingDown style={{ width: '12px', height: '12px' }} />}
                            {sp500.changePercent.toFixed(2)}%
                        </span>
                    </div>
                    <div className="pill">
                        <span style={{ color: '#ec4899', fontWeight: 600 }}>IXIC</span>
                        <span style={{ fontWeight: 600 }}>${nasdaq.currentPrice.toFixed(2)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: nasdaq.change >= 0 ? '#4ade80' : '#f87171' }}>
                            {nasdaq.change >= 0 ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : <TrendingDown style={{ width: '12px', height: '12px' }} />}
                            {nasdaq.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Time Range Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {TIME_RANGES.map(range => (
                    <button key={range.value} onClick={() => setTimeRange(range.value)} className={`pill ${timeRange === range.value ? 'active' : ''}`}>
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <motion.div style={{ flex: 1, minHeight: 0 }} key={timeRange} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line type="monotone" dataKey="sp500" stroke="#22d3ee" strokeWidth={2} dot={false} animationDuration={600} />
                        <Line type="monotone" dataKey="nasdaq" stroke="#ec4899" strokeWidth={2} dot={false} animationDuration={600} />

                        {scenarioActive && (
                            <>
                                <Line type="monotone" dataKey="sp500Scenario" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={600} />
                                <Line type="monotone" dataKey="nasdaqScenario" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={600} opacity={0.7} />
                            </>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
    );
};
