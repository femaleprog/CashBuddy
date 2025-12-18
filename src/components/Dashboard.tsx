import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { StockChart } from './StockChart';
import { EventList } from './EventList';
import { AIAdvisor, type AIAdvisorHandle } from './AIAdvisor';
import { Portfolio } from './Portfolio';
import { generateMockStockData } from '../data/mockStockData';
import { type StockData } from '../types/stockTypes';

export const Dashboard: React.FC = () => {
    const [stockData, setStockData] = useState<{ sp500: StockData; nasdaq: StockData } | null>(null);
    const [aiMessage, setAiMessage] = useState<string | undefined>();
    const aiAdvisorRef = useRef<AIAdvisorHandle>(null);

    useEffect(() => {
        const data = generateMockStockData();
        setStockData(data);
    }, []);

    const handleAskAI = (question: string) => {
        setAiMessage(question);
        // Reset after sending
        setTimeout(() => setAiMessage(undefined), 100);
    };

    if (!stockData) {
        return (
            <div style={{ minHeight: '100vh', background: '#2A2438', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#ec4899', fontSize: '20px' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#2A2438', color: '#DBD8E3' }}>
            {/* CSS Grid Layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr 380px',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* Sidebar */}
                <div style={{ height: '100vh', overflowY: 'auto', borderRight: '1px solid rgba(219,216,227,0.08)' }}>
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main style={{
                    height: '100vh',
                    overflowY: 'auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                }}>
                    {/* Chart */}
                    <StockChart sp500={stockData.sp500} nasdaq={stockData.nasdaq} />

                    {/* News + Portfolio Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', flex: 1, minHeight: 0 }}>
                        <EventList onAskAI={handleAskAI} />
                        <Portfolio />
                    </div>
                </main>

                {/* Right Panel - AI Chat */}
                <div className="right-panel" style={{ height: '100vh', overflow: 'hidden', padding: '24px', borderLeft: '1px solid rgba(219,216,227,0.08)' }}>
                    <AIAdvisor ref={aiAdvisorRef} externalMessage={aiMessage} />
                </div>
            </div>

            {/* Responsive Styles */}
            <style>{`
        @media (max-width: 1400px) {
          .grid {
            grid-template-columns: 240px 1fr !important;
          }
          .right-panel {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};
