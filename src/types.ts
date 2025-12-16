export interface FinancialState {
    age: number;
    income: number;
    expenses: number;
    savings: number;
    investments: number;
    debt: number;
    netWorth: number;
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    impact: {
        income?: number; // Percentage change or absolute value
        expenses?: number;
        savings?: number;
    };
    duration?: number; // Months
}

export interface SimulationResult {
    month: number;
    age: number;
    savings: number;
    investments: number;
    netWorth: number;
}
