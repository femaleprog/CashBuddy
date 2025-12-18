import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Send, Sparkles, Bot, TrendingUp, Calendar, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Message } from '../types/stockTypes';

const PRE_SCRIPTED_RESPONSES: Record<string, string> = {
    'portfolio': 'Based on recent news, your portfolio may experience short-term volatility. Tech regulation news could bring 10-15% swings in tech stocks. S&P 500 and NASDAQ fundamentals remain strong long-term.',
    'forecast': 'For the next week:\n• S&P 500: Moderate upward trend (+1.2%)\n• NASDAQ: Slight volatility due to tech sector\n• Action: Monitor tech stocks closely',
    'long-term': 'Long-term outlook (12 months):\n• S&P 500: Projected 8-12% growth\n• NASDAQ: 12-18% potential with higher volatility\n• Key factors: Fed policy, tech innovation',
    'regulation': 'The EU tech regulation may impact your AAPL and GOOGL holdings. Short-term volatility expected (5-10%), but long-term fundamentals remain strong. Consider maintaining positions.',
    'ai_stocks': 'AI-related stocks in your portfolio (NVDA, MSFT) are positioned to benefit from the valuation surge. NVDA could see +15% in Q1 based on current trends.',
    'default': 'I can help with:\n• Portfolio impact analysis\n• Weekly forecasts\n• Long-term outlook\n\nAsk me anything!',
};

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
}

export const AIAdvisor = forwardRef<AIAdvisorHandle, AIAdvisorProps>(({ externalMessage }, ref) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI Advisor. Based on the latest news, here\'s how it will impact your portfolio. S&P 500 and NASDAQ show resilience despite recent announcements.',
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle external messages from news
    useEffect(() => {
        if (externalMessage) {
            processMessage(externalMessage);
        }
    }, [externalMessage]);

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
            let responseText = PRE_SCRIPTED_RESPONSES.default;
            const input = text.toLowerCase();

            if (input.includes('regulation') || input.includes('eu tech')) {
                responseText = PRE_SCRIPTED_RESPONSES.regulation;
            } else if (input.includes('ai') || input.includes('startup') || input.includes('valuation')) {
                responseText = PRE_SCRIPTED_RESPONSES.ai_stocks;
            } else if (input.includes('portfolio') || input.includes('affect') || input.includes('impact') || input.includes('nasdaq')) {
                responseText = PRE_SCRIPTED_RESPONSES.portfolio;
            } else if (input.includes('forecast') || input.includes('week') || input.includes('next')) {
                responseText = PRE_SCRIPTED_RESPONSES.forecast;
            } else if (input.includes('long') || input.includes('outlook') || input.includes('future')) {
                responseText = PRE_SCRIPTED_RESPONSES['long-term'];
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date(),
            };

            setIsTyping(false);
            setMessages(prev => [...prev, aiMessage]);
        }, 1200);
    };

    useImperativeHandle(ref, () => ({
        sendMessage: (message: string) => {
            processMessage(message);
        }
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

    return (
        <div className="modern-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(219,216,227,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
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
                                <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{message.text}</p>
                                <span style={{ fontSize: '10px', opacity: 0.5, display: 'block', marginTop: '8px' }}>
                                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                        <div className="chat-bubble assistant" style={{ display: 'flex', gap: '4px', padding: '14px 18px' }}>
                            <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                            <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite 0.15s' }} />
                            <span style={{ width: '6px', height: '6px', background: 'rgba(219,216,227,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }} />
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
                        <button
                            key={index}
                            onClick={() => setInputValue(prompt.text)}
                            className="pill"
                            style={{ fontSize: '13px' }}
                        >
                            <Icon style={{ width: '14px', height: '14px' }} />
                            {prompt.text}
                        </button>
                    );
                })}
            </div>

            {/* Composer */}
            <div style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                background: 'rgba(219,216,227,0.04)',
                borderRadius: '16px',
                border: '1px solid rgba(219,216,227,0.08)'
            }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your portfolio..."
                    className="input-modern"
                    style={{ background: 'transparent', border: 'none', padding: '8px 0' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="send-button"
                >
                    <Send style={{ width: '18px', height: '18px', color: '#fff' }} />
                </button>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
        </div>
    );
});

AIAdvisor.displayName = 'AIAdvisor';
