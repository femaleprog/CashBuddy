import React from 'react';
import { Card } from './ui/Card';
import { Trophy, Star, Shield, TrendingUp } from 'lucide-react';
import { type FinancialState } from '../types';
import { motion } from 'framer-motion';

interface GamificationProps {
    state: FinancialState;
}

export const Gamification: React.FC<GamificationProps> = ({ state }) => {
    const savingsRate = (state.income - state.expenses) / state.income;
    const score = Math.min(100, Math.max(0, Math.round(
        (savingsRate * 100 * 2) + // Up to 60 points for 30% savings
        (state.investments > 0 ? 20 : 0) + // 20 points for investing
        (state.debt === 0 ? 20 : 0) // 20 points for no debt
    )));

    const badges = [
        { name: "Saver", icon: Shield, earned: savingsRate > 0.2, color: "text-blue-400" },
        { name: "Investor", icon: TrendingUp, earned: state.investments > 10000, color: "text-green-400" },
        { name: "Debt Free", icon: Star, earned: state.debt === 0, color: "text-yellow-400" },
    ];

    // Helper for icon component since we can't use dynamic component names easily in map without correct typing
    const Icon = ({ icon: IconComp, className }: { icon: any, className: string }) => <IconComp className={className} />;

    return (
        <Card className="p-4 bg-secondary/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Trophy className="text-yellow-500 w-5 h-5" />
                    Financial Health
                </h3>
                <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {score}/100
                </span>
            </div>

            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
                <motion.div
                    className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>

            <div className="flex justify-between">
                {badges.map((badge) => (
                    <div key={badge.name} className={`flex flex-col items-center gap-1 ${badge.earned ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                        <div className="p-2 bg-background rounded-full border border-border">
                            <Icon icon={badge.icon} className={`w-5 h-5 ${badge.color}`} />
                        </div>
                        <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};


