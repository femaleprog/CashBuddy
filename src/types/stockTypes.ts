export interface StockPrice {
    timestamp: Date;
    price: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    close: number;
}

export interface StockData {
    symbol: string;
    name: string;
    prices: StockPrice[];
    currentPrice: number;
    change: number;
    changePercent: number;
}

export interface Portfolio {
    totalValue: number;
    dailyChange: number;
    dailyChangePercent: number;
    holdings: {
        symbol: string;
        shares: number;
        value: number;
    }[];
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}
