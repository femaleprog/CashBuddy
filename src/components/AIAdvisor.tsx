import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Sparkles, Bot, TrendingUp, TrendingDown, Calendar, HelpCircle, Shield, AlertTriangle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Message } from '../types/stockTypes';

interface ImpactAnalysis {
    riskDirection: 'bullish' | 'bearish' | 'neutral';
    horizon: string;
    confidence: number;
    impactedHoldings: { symbol: string; impact: string; direction: 'up' | 'down' }[];
    summary: string;
}

interface ActionButton {
    label: string;
    action: string;
    icon: React.ElementType;
}

const IMPACT_ANALYSES: Record<string, ImpactAnalysis> = {
    'regulation': {
        riskDirection: 'bearish',
        horizon: 'Short-term (1-2 weeks)',
        confidence: 72,
        impactedHoldings: [
            { symbol: 'AAPL', impact: '-3.5%', direction: 'down' },
            { symbol: 'GOOGL', impact: '-4.2%', direction: 'down' },
            { symbol: 'MSFT', impact: '-2.1%', direction: 'down' },
        ],
        summary: 'New EU tech regulation may create short-term volatility. Tech giants face compliance costs and potential fines.',
    },
    'ai': {
        riskDirection: 'bullish',
        horizon: 'Medium-term (1-3 months)',
        confidence: 85,
        impactedHoldings: [
            { symbol: 'NVDA', impact: '+12.5%', direction: 'up' },
            { symbol: 'MSFT', impact: '+5.3%', direction: 'up' },
        ],
        summary: 'AI sector optimism drives valuations. Your AI-related holdings are positioned to benefit.',
    },
    'fed': {
        riskDirection: 'neutral',
        horizon: 'Short-term (1 week)',
        confidence: 68,
        impactedHoldings: [
            { symbol: 'AAPL', impact: '+0.5%', direction: 'up' },
            { symbol: 'MSFT', impact: '+0.3%', direction: 'up' },
        ],
        summary: 'Stable rate environment maintains market equilibrium. Limited direct impact expected.',
    },
    'default': {
        riskDirection: 'neutral',
        horizon: 'Variable',
        confidence: 60,
        impactedHoldings: [],
        summary: 'Analyzing market conditions for potential portfolio impact.',
    },
};

const ACTION_BUTTONS: ActionButton[] = [
    { label: 'Create hedge scenario', action: 'hedge', icon: Shield },
    { label: 'Reduce exposure', action: 'reduce', icon: TrendingDown },
    { label: 'Set alert', action: 'alert', icon: Bell },
];

const QUICK_PROMPTS = [
    { text: 'Impact on NASDAQ?', icon: TrendingUp },
    { text: 'What changed today?', icon: HelpCircle },
    { text: 'Forecast next week', icon: Calendar },
];

export interface AIAdvisorHandle {
    sendMessage: (message: string) => void;
}

interface AIAdvisorProps {
    externalMessage?: string;
    onAction?: (action: string, holdings: string[]) => void;
    onHighlightHoldings?: (symbols: string[]) => void;
}

export const AIAdvisor = forwardRef<AIAdvisorHandle, AIAdvisorProps>(({ externalMessage, onAction, onHighlightHoldings }, ref) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI Advisor. Click "Impact on Portfolio?" on any news item to get personalized analysis.',
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [analyzingCount, setAnalyzingCount] = useState(0);
    const [currentAnalysis, setCurrentAnalysis] = useState<ImpactAnalysis | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (externalMessage) {
            processNewsQuestion(externalMessage);
        }
    }, [externalMessage]);

    const getAnalysisForMessage = (text: string): ImpactAnalysis => {
        const lower = text.toLowerCase();
        if (lower.includes('regulation') || lower.includes('eu tech')) {
            return IMPACT_ANALYSES.regulation;
        } else if (lower.includes('ai') || lower.includes('startup') || lower.includes('valuation')) {
            return IMPACT_ANALYSES.ai;
        } else if (lower.includes('fed') || lower.includes('rate')) {
            return IMPACT_ANALYSES.fed;
        }
        return IMPACT_ANALYSES.default;
    };

    const processNewsQuestion = (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Start analyzing state
        setIsTyping(true);
        setAnalyzingCount(3);

        // Countdown animation
        const countInterval = setInterval(() => {
            setAnalyzingCount(prev => {
                if (prev <= 1) {
                    clearInterval(countInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 400);

        setTimeout(() => {
            const analysis = getAnalysisForMessage(text);
            setCurrentAnalysis(analysis);
            setIsTyping(false);

            // Highlight holdings in portfolio
            if (onHighlightHoldings && analysis.impactedHoldings.length > 0) {
                onHighlightHoldings(analysis.impactedHoldings.map(h => h.symbol));
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: '__IMPACT_ANALYSIS__',
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 1800);
    };

    const processMessage = (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'I can provide detailed analysis when you click "Impact on Portfolio?" on a news item. Try it to see personalized insights!',
                sender: 'ai',
                timestamp: new Date(),
            };
            setIsTyping(false);
            setMessages(prev => [...prev, aiMessage]);
        }, 800);
    };

    useImperativeHandle(ref, () => ({
        sendMessage: (message: string) => processNewsQuestion(message)
    }));

    const handleSend = () => {
        if (!inputValue.trim()) return;
        processMessage(inputValue);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAction = (action: string) => {
        if (onAction && currentAnalysis) {
            onAction(action, currentAnalysis.impactedHoldings.map(h => h.symbol));
        }
    };

    const renderImpactAnalysis = () => {
        if (!currentAnalysis) return null;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Summary */}
                <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#DBD8E3' }}>{currentAnalysis.summary}</p>

                {/* Risk Metrics */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        background: currentAnalysis.riskDirection === 'bullish' ? 'rgba(34,197,94,0.15)' : currentAnalysis.riskDirection === 'bearish' ? 'rgba(239,68,68,0.15)' : 'rgba(219,216,227,0.1)',
                        color: currentAnalysis.riskDirection === 'bullish' ? '#4ade80' : currentAnalysis.riskDirection === 'bearish' ? '#f87171' : '#DBD8E3',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {currentAnalysis.riskDirection === 'bullish' ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : currentAnalysis.riskDirection === 'bearish' ? <TrendingDown style={{ width: '12px', height: '12px' }} /> : <AlertTriangle style={{ width: '12px', height: '12px' }} />}
                        {currentAnalysis.riskDirection.toUpperCase()}
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(219,216,227,0.1)', fontSize: '12px', color: '#DBD8E3' }}>
                        {currentAnalysis.horizon}
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(236,72,153,0.15)', fontSize: '12px', color: '#ec4899' }}>
                        {currentAnalysis.confidence}% confidence
                    </div>
                </div>

                {/* Impacted Holdings */}
                {currentAnalysis.impactedHoldings.length > 0 && (
                    <div style={{ background: 'rgba(219,216,227,0.04)', borderRadius: '10px', padding: '10px' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(219,216,227,0.6)', marginBottom: '8px', fontWeight: 600 }}>IMPACTED HOLDINGS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {currentAnalysis.impactedHoldings.map(holding => (
                                <div key={holding.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{holding.symbol}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: holding.direction === 'up' ? '#4ade80' : '#f87171' }}>
                                        {holding.impact}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {ACTION_BUTTONS.map(btn => {
                        const Icon = btn.icon;
                        return (
                            <button
                                key={btn.action}
                                onClick={() => handleAction(btn.action)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    borderRadius: '999px',
                                    background: 'rgba(236,72,153,0.12)',
                                    border: '1px solid rgba(236,72,153,0.25)',
                                    color: '#ec4899',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.2)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.12)'; }}
                            >
                                <Icon style={{ width: '14px', height: '14px' }} />
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="modern-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(219,216,227,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot style={{ width: '20px', height: '20px', color: '#fff' }} />
                    </div>
                    <div>
                        <h3 className="text-section-title">AI Advisor</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                            <span style={{ fontSize: '11px', color: '#4ade80' }}>Online</span>
                        </div>
                    </div>
                </div>
                <Sparkles style={{ width: '18px', height: '18px', color: '#ec4899' }} />
            </div>

            {/* Messages */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                        >
                            <div className={`chat-bubble ${message.sender === 'user' ? 'user' : 'assistant'}`}>
                                {message.text === '__IMPACT_ANALYSIS__' ? renderImpactAnalysis() : (
                                    <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{message.text}</p>
                                )}
                                <span style={{ fontSize: '10px', opacity: 0.5, display: 'block', marginTop: '8px' }}>
                                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing / Analyzing Indicator */}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div className="chat-bubble assistant" style={{ padding: '14px 18px' }}>
                            {analyzingCount > 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(236,72,153,0.3)', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontSize: '13px', color: 'rgba(219,216,227,0.8)' }}>Analyzing {analyzingCount} articles…</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                                    <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite 0.15s' }} />
                                    <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '12px' }}>
                {QUICK_PROMPTS.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                        <button key={index} onClick={() => setInputValue(prompt.text)} className="pill" style={{ fontSize: '13px' }}>
                            <Icon style={{ width: '14px', height: '14px' }} />
                            {prompt.text}
                        </button>
                    );
                })}
            </div>

            {/* Composer */}
            <div style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(219,216,227,0.04)', borderRadius: '16px', border: '1px solid rgba(219,216,227,0.08)' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your portfolio..."
                    className="input-modern"
                    style={{ background: 'transparent', border: 'none', padding: '8px 0' }}
                />
                <button onClick={handleSend} disabled={!inputValue.trim()} className="send-button">
                    <Send style={{ width: '18px', height: '18px', color: '#fff' }} />
                </button>
            </div>

            <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
});

AIAdvisor.displayName = 'AIAdvisor';
