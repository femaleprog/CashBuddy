import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Holding {
    symbol: string;
    name: string;
    shares: number;
    price: number;
    change: number;
    changePercent: number;
}

const MOCK_HOLDINGS: Holding[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, price: 178.50, change: 2.35, changePercent: 1.34 },
    { symbol: 'MSFT', name: 'Microsoft', shares: 15, price: 378.20, change: -1.80, changePercent: -0.47 },
    { symbol: 'GOOGL', name: 'Alphabet', shares: 10, price: 141.80, change: 3.20, changePercent: 2.31 },
    { symbol: 'NVDA', name: 'NVIDIA', shares: 8, price: 495.50, change: 12.40, changePercent: 2.57 },
];

const PERFORMANCE = [
    { label: '1D', value: 1.24 },
    { label: '1W', value: 3.56 },
    { label: '1M', value: -0.82 },
    { label: 'YTD', value: 18.45 },
];

export const Portfolio: React.FC = () => {
    const totalValue = MOCK_HOLDINGS.reduce((sum, h) => sum + h.shares * h.price, 0);
    const todayChange = MOCK_HOLDINGS.reduce((sum, h) => sum + h.shares * h.change, 0);
    const todayChangePercent = (todayChange / (totalValue - todayChange)) * 100;

    return (
        <div className="modern-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(236, 72, 153, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Wallet style={{ width: '20px', height: '20px', color: '#ec4899' }} />
                    </div>
                    <h3 className="text-section-title">My Portfolio</h3>
                </div>
            </div>

            {/* Total Value */}
            <div style={{ padding: '16px', background: 'rgba(219,216,227,0.04)', borderRadius: '12px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(219,216,227,0.65)', marginBottom: '4px' }}>Total Value</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: todayChange >= 0 ? '#4ade80' : '#f87171'
                    }}>
                        {todayChange >= 0 ? <TrendingUp style={{ width: '14px', height: '14px' }} /> : <TrendingDown style={{ width: '14px', height: '14px' }} />}
                        {todayChange >= 0 ? '+' : ''}{todayChangePercent.toFixed(2)}% today
                    </span>
                </div>
            </div>

            {/* Performance Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PERFORMANCE.map(p => (
                    <div key={p.label} style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        background: 'rgba(219,216,227,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ fontSize: '12px', color: 'rgba(219,216,227,0.65)' }}>{p.label}</span>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: p.value >= 0 ? '#4ade80' : '#f87171'
                        }}>
                            {p.value >= 0 ? '+' : ''}{p.value.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Holdings */}
            <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(219,216,227,0.75)', marginBottom: '12px' }}>Top Holdings</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {MOCK_HOLDINGS.map(holding => (
                        <div key={holding.symbol} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            background: 'rgba(53,47,68,0.5)',
                            borderRadius: '12px',
                            border: '1px solid rgba(219,216,227,0.06)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(219,216,227,0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#ec4899'
                                }}>
                                    {holding.symbol.slice(0, 2)}
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{holding.symbol}</p>
                                    <p style={{ fontSize: '11px', color: 'rgba(219,216,227,0.6)' }}>{holding.shares} shares</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>${holding.price.toFixed(2)}</p>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: holding.change >= 0 ? '#4ade80' : '#f87171'
                                }}>
                                    {holding.change >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
