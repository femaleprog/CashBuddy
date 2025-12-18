import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { StockChart } from './StockChart';
import { EventList, NEWS_DATA, type NewsContext } from './EventList';
import { AIAdvisor, type AIAdvisorHandle } from './AIAdvisor';
import { Portfolio } from './Portfolio';
import { Toast } from './Toast';
import { generateMockStockData } from '../data/mockStockData';
import { type StockData } from '../types/stockTypes';

const IMPACTED_HOLDINGS_MAP: Record<string, string[]> = {
    'regulation': ['AAPL', 'GOOGL', 'MSFT'],
    'ai': ['NVDA', 'MSFT'],
    'fed': ['AAPL', 'MSFT'],
    'supply': ['AAPL'],
};

export const Dashboard: React.FC = () => {
    const [stockData, setStockData] = useState<{ sp500: StockData; nasdaq: StockData } | null>(null);
    const [aiMessage, setAiMessage] = useState<string | undefined>();
    const [newsContext, setNewsContext] = useState<NewsContext | undefined>();
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

    const handleAskAI = useCallback((question: string, context: NewsContext) => {
        setNewsContext(context);
        setAiMessage(question);
        setTimeout(() => setAiMessage(undefined), 100);
    }, []);

    const handleSelectNews = useCallback((newsKey: string) => {
        const newsItem = NEWS_DATA.find(n => n.analysisKey === newsKey);
        if (newsItem) {
            const context: NewsContext = {
                headline: newsItem.title,
                category: newsItem.category,
                source: newsItem.source,
                impactScore: newsItem.impact,
                impactedHoldings: IMPACTED_HOLDINGS_MAP[newsItem.analysisKey] || [],
                analysisKey: newsItem.analysisKey,
            };
            handleAskAI(`How does "${newsItem.title}" impact my portfolio?`, context);
        }
    }, [handleAskAI]);

    const handleHighlightHoldings = (symbols: string[]) => {
        setHighlightedHoldings(symbols);
        setTimeout(() => setHighlightedHoldings([]), 10000);
    };

    const handleAction = (_action: string, _holdings: string[]) => {
        setScenarioActive(true);
        setScenarioType(_action as 'hedge' | 'reduce' | 'alert');

        let delta = 0;
        if (_action === 'hedge') {
            delta = -2.5;
        } else if (_action === 'reduce') {
            delta = -5.2;
        } else if (_action === 'alert') {
            delta = 0;
        }
        setScenarioDelta(delta);

        const actionLabels: Record<string, string> = {
            hedge: 'Hedge scenario applied to chart',
            reduce: 'Reduced exposure scenario applied',
            alert: 'Price alert set for impacted holdings',
        };
        setToastMessage(actionLabels[_action] || 'Scenario applied');
        setToastVisible(true);

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
        <div className="dashboard-root">
            {/* CSS Grid Layout */}
            <div className="dashboard-grid">
                {/* Sidebar */}
                <aside className="sidebar-container">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Chart */}
                    <StockChart
                        sp500={stockData.sp500}
                        nasdaq={stockData.nasdaq}
                        scenarioActive={scenarioActive}
                        scenarioType={scenarioType}
                    />

                    {/* News + Portfolio Row */}
                    <div className="content-row">
                        <EventList onAskAI={handleAskAI} />
                        <div className="portfolio-container">
                            <Portfolio
                                highlightedHoldings={highlightedHoldings}
                                scenarioDelta={scenarioDelta}
                            />
                        </div>
                    </div>
                </main>

                {/* Right Panel - AI Chat */}
                <aside className="chat-panel">
                    <AIAdvisor
                        ref={aiAdvisorRef}
                        externalMessage={aiMessage}
                        newsContext={newsContext}
                        onAction={handleAction}
                        onHighlightHoldings={handleHighlightHoldings}
                        onSelectNews={handleSelectNews}
                    />
                </aside>
            </div>

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                isVisible={toastVisible}
                onClose={() => setToastVisible(false)}
            />

            {/* Responsive Styles */}
            <style>{`
        .dashboard-root {
          min-height: 100vh;
          background: #2A2438;
          color: #DBD8E3;
          overflow-x: hidden;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 220px 1fr 360px;
          height: 100vh;
          overflow: hidden;
          max-width: 100vw;
        }

        .sidebar-container {
          height: 100vh;
          overflow-y: auto;
          border-right: 1px solid rgba(219,216,227,0.08);
          min-width: 0;
        }

        .main-content {
          height: 100vh;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        .content-row {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          flex: 1;
          min-height: 0;
        }

        .portfolio-container {
          min-width: 0;
        }

        .chat-panel {
          height: 100vh;
          overflow: hidden;
          padding: 20px;
          border-left: 1px solid rgba(219,216,227,0.08);
          min-width: 0;
        }

        /* Large screens: 1400px+ */
        @media (min-width: 1400px) {
          .dashboard-grid {
            grid-template-columns: 240px 1fr 380px;
          }
          .content-row {
            grid-template-columns: 1fr 340px;
          }
          .main-content {
            padding: 24px;
            gap: 24px;
          }
        }

        /* Medium screens: hide chat panel */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 200px 1fr;
          }
          .chat-panel {
            display: none;
          }
          .content-row {
            grid-template-columns: 1fr 280px;
          }
        }

        /* Small screens: stack layout */
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            height: auto;
          }
          .sidebar-container {
            display: none;
          }
          .main-content {
            height: auto;
            min-height: 100vh;
            padding: 16px;
          }
          .content-row {
            grid-template-columns: 1fr;
          }
          .portfolio-container {
            order: -1;
          }
        }
      `}</style>
        </div>
    );
};
