import React, { useState } from 'react';
import { Globe, Briefcase, Cpu, Building2, DollarSign, TrendingUp, TrendingDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NewsItem {
    id: string;
    title: string;
    source: string;
    time: string;
    category: 'Business' | 'Technology' | 'Politics' | 'Economy';
    impact: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    summary: string;
    analysisKey: string;
}

export interface NewsContext {
    headline: string;
    category: string;
    source: string;
    impactScore: number;
    impactedHoldings: string[];
    analysisKey: string;
}

interface EventListProps {
    onAskAI?: (question: string, context: NewsContext) => void;
}

export const NEWS_DATA: NewsItem[] = [
    {
        id: '1',
        title: "Breaking: New EU Tech Regulation Announced",
        source: "Business Insider",
        time: "11h ago",
        category: "Politics",
        impact: 75,
        sentiment: 'negative',
        summary: "European Commission announces strict data privacy rules affecting tech companies.",
        analysisKey: 'regulation',
    },
    {
        id: '2',
        title: "AI Startup Valuations Expected to Soar",
        source: "TechCrunch",
        time: "2h ago",
        category: "Technology",
        impact: 85,
        sentiment: 'positive',
        summary: "Venture capital firms predict AI startup valuations could triple by end of year.",
        analysisKey: 'ai',
    },
    {
        id: '3',
        title: "Fed to Hold Rates Steady Next Quarter",
        source: "CNBC",
        time: "3h ago",
        category: "Economy",
        impact: 40,
        sentiment: 'neutral',
        summary: "Federal Reserve signals intention to maintain current interest rates through Q2.",
        analysisKey: 'fed',
    },
    {
        id: '4',
        title: "Global Supply Chain Optimization Trends",
        source: "Bloomberg",
        time: "5h ago",
        category: "Business",
        impact: 30,
        sentiment: 'positive',
        summary: "Manufacturing efficiency improvements drive cost reductions globally.",
        analysisKey: 'supply',
    }
];

const IMPACTED_HOLDINGS_MAP: Record<string, string[]> = {
    'regulation': ['AAPL', 'GOOGL', 'MSFT'],
    'ai': ['NVDA', 'MSFT'],
    'fed': ['AAPL', 'MSFT'],
    'supply': ['AAPL'],
};

const CATEGORIES = [
    { label: 'All', value: 'All', icon: Globe },
    { label: 'Business', value: 'Business', icon: Briefcase },
    { label: 'Tech', value: 'Technology', icon: Cpu },
    { label: 'Politics', value: 'Politics', icon: Building2 },
    { label: 'Economy', value: 'Economy', icon: DollarSign },
];

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Business': return Briefcase;
        case 'Technology': return Cpu;
        case 'Politics': return Building2;
        case 'Economy': return DollarSign;
        default: return Globe;
    }
};

export const EventList: React.FC<EventListProps> = ({ onAskAI }) => {
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const filteredNews = activeCategory === 'All'
        ? NEWS_DATA
        : NEWS_DATA.filter(item => item.category === activeCategory);

    const handleAskAI = (item: NewsItem) => {
        const context: NewsContext = {
            headline: item.title,
            category: item.category,
            source: item.source,
            impactScore: item.impact,
            impactedHoldings: IMPACTED_HOLDINGS_MAP[item.analysisKey] || [],
            analysisKey: item.analysisKey,
        };

        if (onAskAI) {
            onAskAI(`How does "${item.title}" impact my portfolio?`, context);
        }
    };

    return (
        <div className="modern-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 className="text-section-title">Top News</h3>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`pill ${activeCategory === cat.value ? 'active' : ''}`}
                            >
                                <Icon style={{ width: '14px', height: '14px' }} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* News List */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence mode="popLayout">
                    {filteredNews.map((item) => {
                        const CategoryIcon = getCategoryIcon(item.category);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="news-card">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        {/* Category Icon */}
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '12px',
                                            background: 'rgba(219,216,227,0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <CategoryIcon style={{ width: '20px', height: '20px', color: '#ec4899' }} />
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'rgba(255,255,255,0.92)',
                                                marginBottom: '4px',
                                                lineHeight: 1.4
                                            }}>
                                                {item.title}
                                            </h4>
                                            <p style={{
                                                fontSize: '13px',
                                                color: 'rgba(219,216,227,0.65)',
                                                marginBottom: '10px',
                                                lineHeight: 1.4
                                            }}>
                                                {item.summary}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', marginBottom: '10px' }}>
                                                <span style={{ color: 'rgba(219,216,227,0.75)', fontWeight: 500 }}>{item.source}</span>
                                                <span style={{ color: 'rgba(219,216,227,0.5)' }}>•</span>
                                                <span style={{ color: 'rgba(219,216,227,0.75)' }}>{item.time}</span>
                                                <span className={`impact-badge ${item.sentiment}`}>
                                                    {item.sentiment === 'positive' ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : <TrendingDown style={{ width: '12px', height: '12px' }} />}
                                                    {item.impact}%
                                                </span>
                                            </div>

                                            {/* Ask AI Button */}
                                            <button
                                                onClick={() => handleAskAI(item)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 14px',
                                                    borderRadius: '999px',
                                                    background: 'rgba(236, 72, 153, 0.12)',
                                                    border: '1px solid rgba(236, 72, 153, 0.2)',
                                                    color: '#ec4899',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.12)';
                                                }}
                                            >
                                                <MessageCircle style={{ width: '14px', height: '14px' }} />
                                                Impact on Portfolio?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
