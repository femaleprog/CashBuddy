import { type StockData, type StockPrice } from '../types/stockTypes';

// Generate realistic mock stock data
const generateStockPrices = (
    basePrice: number,
    days: number,
    volatility: number = 0.02
): StockPrice[] => {
    const prices: StockPrice[] = [];
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - i);

        // Random walk with volatility
        const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
        currentPrice += change;

        const open = currentPrice + (Math.random() - 0.5) * volatility * currentPrice * 0.5;
        const close = currentPrice + (Math.random() - 0.5) * volatility * currentPrice * 0.5;
        const high = Math.max(open, close, currentPrice) * (1 + Math.random() * volatility * 0.5);
        const low = Math.min(open, close, currentPrice) * (1 - Math.random() * volatility * 0.5);

        prices.push({
            timestamp,
            price: currentPrice,
            open,
            close,
            high,
            low,
            volume: Math.floor(Math.random() * 100000000 + 50000000),
        });
    }

    return prices;
};

export const generateMockStockData = (): { sp500: StockData; nasdaq: StockData } => {
    // S&P 500 mock data (starting around 4500)
    const sp500Prices = generateStockPrices(4500, 365, 0.015);
    const sp500Current = sp500Prices[sp500Prices.length - 1].price;
    const sp500Previous = sp500Prices[sp500Prices.length - 2].price;

    // NASDAQ mock data (starting around 14000)
    const nasdaqPrices = generateStockPrices(14000, 365, 0.025);
    const nasdaqCurrent = nasdaqPrices[nasdaqPrices.length - 1].price;
    const nasdaqPrevious = nasdaqPrices[nasdaqPrices.length - 2].price;

    return {
        sp500: {
            symbol: 'SPX',
            name: 'S&P 500',
            prices: sp500Prices,
            currentPrice: sp500Current,
            change: sp500Current - sp500Previous,
            changePercent: ((sp500Current - sp500Previous) / sp500Previous) * 100,
        },
        nasdaq: {
            symbol: 'IXIC',
            name: 'NASDAQ',
            prices: nasdaqPrices,
            currentPrice: nasdaqCurrent,
            change: nasdaqCurrent - nasdaqPrevious,
            changePercent: ((nasdaqCurrent - nasdaqPrevious) / nasdaqPrevious) * 100,
        },
    };
};
