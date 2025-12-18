import React from 'react';
import { Card } from './ui/Card';
import { TrendingUp, Calendar, Wallet, PiggyBank } from 'lucide-react';
import { type FinancialState } from '../types';

interface SummaryCardsProps {
    state: FinancialState;
    netWorthAt40: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ state, netWorthAt40 }) => {
    const monthlySurplus = state.income - state.expenses;
    const savingsRate = Math.round((monthlySurplus / state.income) * 100);

    // Estimate goal date (e.g., $1M) based on simple projection
    // This is a simplified calculation for the UI demo
    const goalAmount = 1000000;
    const monthsToGoal = monthlySurplus > 0
        ? Math.max(0, (goalAmount - state.netWorth) / monthlySurplus)
        : 999;
    const goalDate = new Date();
    goalDate.setMonth(goalDate.getMonth() + monthsToGoal);
    const goalDateString = monthlySurplus > 0
        ? goalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : "Never";

    const metrics = [
        {
            label: "At 40 you'll have",
            value: `€${(netWorthAt40 / 1000).toFixed(0)}k`,
            icon: Wallet,
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            label: "Monthly surplus",
            value: `€${monthlySurplus}`,
            icon: PiggyBank,
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            label: "Savings rate",
            value: `${savingsRate}%`,
            icon: TrendingUp,
            color: savingsRate > 20 ? "text-green-400" : "text-yellow-400",
            bg: savingsRate > 20 ? "bg-green-400/10" : "bg-yellow-400/10"
        },
        {
            label: "Goal hit date",
            value: goalDateString,
            icon: Calendar,
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
                <Card key={index} className="p-4 flex flex-col justify-between border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-muted-foreground font-medium">{metric.label}</span>
                        <div className={`p-2 rounded-lg ${metric.bg}`}>
                            <metric.icon className={`w-4 h-4 ${metric.color}`} />
                        </div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
                </Card>
            ))}
        </div>
    );
};
