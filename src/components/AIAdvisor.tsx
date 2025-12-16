import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import { Bot, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type FinancialState } from '../types';

interface AIAdvisorProps {
    state: FinancialState;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ state }) => {
    const tips = useMemo(() => {
        const t = [];
        const savingsRate = (state.income - state.expenses) / state.income;

        if (savingsRate < 0.1) {
            t.push({
                icon: AlertTriangle,
                color: "text-red-500",
                bg: "bg-red-500/10",
                text: "Your savings rate is low (<10%). Try cutting expenses to boost your safety net."
            });
        } else if (savingsRate > 0.3) {
            t.push({
                icon: TrendingUp,
                color: "text-green-500",
                bg: "bg-green-500/10",
                text: "Great job! You're saving over 30% of your income. You're on the fast track to financial freedom."
            });
        }

        if (state.debt > 0) {
            t.push({
                icon: AlertTriangle,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                text: `You have $${state.debt} in debt. Prioritize paying this off to avoid interest eating your wealth.`
            });
        }

        if (state.investments < state.savings && state.savings > state.expenses * 6) {
            t.push({
                icon: Sparkles,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                text: "You have a lot of cash sitting idle. Consider investing more to beat inflation."
            });
        }

        if (t.length === 0) {
            t.push({
                icon: Bot,
                color: "text-primary",
                bg: "bg-primary/10",
                text: "Your finances look balanced! Keep experimenting with scenarios to optimize further."
            });
        }

        return t;
    }, [state]);

    return (
        <Card variant="glass" className="p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot size={64} />
            </div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-primary/20 rounded-full">
                    <Sparkles className="text-primary w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">AI Advisor</h3>
            </div>
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {tips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg text-sm flex gap-3 items-start ${tip.bg}`}
                        >
                            <tip.icon className={`w-5 h-5 shrink-0 ${tip.color}`} />
                            <p>{tip.text}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </Card>
    );
};
