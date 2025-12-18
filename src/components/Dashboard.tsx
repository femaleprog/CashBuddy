import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { StockChart } from './StockChart';
import { EventList } from './EventList';
import { AIAdvisor, type AIAdvisorHandle } from './AIAdvisor';
import { Portfolio } from './Portfolio';
import { Toast } from './Toast';
import { generateMockStockData } from '../data/mockStockData';
import { type StockData } from '../types/stockTypes';

export const Dashboard: React.FC = () => {
    const [stockData, setStockData] = useState<{ sp500: StockData; nasdaq: StockData } | null>(null);
    const [aiMessage, setAiMessage] = useState<string | undefined>();
    const [highlightedHoldings, setHighlightedHoldings] = useState<string[]>([]);
    const [scenarioActive, setScenarioActive] = useState(false);
    const [scenarioType, setScenarioType] = useState<'hedge' | 'reduce' | 'alert' | undefined>();
    const [scenarioDelta, setScenarioDelta] = useState<number | undefined>();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const aiAdvisorRef = useRef<AIAdvisorHandle>(null);

    useEffect(() => {
        const data = generateMockStockData();
        setStockData(data);
    }, []);

    const handleAskAI = (question: string) => {
        setAiMessage(question);
        setTimeout(() => setAiMessage(undefined), 100);
    };

    const handleHighlightHoldings = (symbols: string[]) => {
        setHighlightedHoldings(symbols);
        // Clear after 10 seconds
        setTimeout(() => setHighlightedHoldings([]), 10000);
    };

    const handleAction = (action: string, _holdings: string[]) => {
        setScenarioActive(true);
        setScenarioType(action as 'hedge' | 'reduce' | 'alert');

        // Calculate scenario delta based on action
        let delta = 0;
        if (action === 'hedge') {
            delta = -2.5; // Hedge reduces exposure
        } else if (action === 'reduce') {
            delta = -5.2; // Reduce cuts more
        } else if (action === 'alert') {
            delta = 0; // Alert doesn't change anything
        }
        setScenarioDelta(delta);

        // Show toast
        const actionLabels: Record<string, string> = {
            hedge: 'Hedge scenario applied to chart',
            reduce: 'Reduced exposure scenario applied',
            alert: 'Price alert set for impacted holdings',
        };
        setToastMessage(actionLabels[action] || 'Scenario applied');
        setToastVisible(true);

        // Clear scenario after 30 seconds
        setTimeout(() => {
            setScenarioActive(false);
            setScenarioType(undefined);
            setScenarioDelta(undefined);
        }, 30000);
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
                    <StockChart
                        sp500={stockData.sp500}
                        nasdaq={stockData.nasdaq}
                        scenarioActive={scenarioActive}
                        scenarioType={scenarioType}
                    />

                    {/* News + Portfolio Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', flex: 1, minHeight: 0 }}>
                        <EventList onAskAI={handleAskAI} />
                        <Portfolio
                            highlightedHoldings={highlightedHoldings}
                            scenarioDelta={scenarioDelta}
                        />
                    </div>
                </main>

                {/* Right Panel - AI Chat */}
                <div className="right-panel" style={{ height: '100vh', overflow: 'hidden', padding: '24px', borderLeft: '1px solid rgba(219,216,227,0.08)' }}>
                    <AIAdvisor
                        ref={aiAdvisorRef}
                        externalMessage={aiMessage}
                        onAction={handleAction}
                        onHighlightHoldings={handleHighlightHoldings}
                    />
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                isVisible={toastVisible}
                onClose={() => setToastVisible(false)}
            />

            {/* Responsive Styles */}
            <style>{`
        @media (max-width: 1400px) {
          .grid { grid-template-columns: 240px 1fr !important; }
          .right-panel { display: none; }
        }
      `}</style>
        </div>
    );
};
