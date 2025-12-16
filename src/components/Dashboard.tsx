import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timeline } from './Timeline';
import { AIAdvisor } from './AIAdvisor';
import { Gamification } from './Gamification';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import { type FinancialState, type SimulationResult } from '../types';
import { Play, RefreshCw, TrendingUp } from 'lucide-react';

const INITIAL_STATE: FinancialState = {
    age: 25,
    income: 4000,
    expenses: 2500,
    savings: 10000,
    investments: 5000,
    debt: 0,
    netWorth: 15000,
};

export const Dashboard: React.FC = () => {
    const [state, setState] = useState<FinancialState>(INITIAL_STATE);
    const [simulationData, setSimulationData] = useState<SimulationResult[]>([]);

    const runSimulation = () => {
        const results: SimulationResult[] = [];
        let currentSavings = state.savings;
        let currentInvestments = state.investments;
        let currentAge = state.age;
        const monthlySavings = state.income - state.expenses;

        for (let i = 0; i < 30 * 12; i++) { // 30 years
            // Simple compound interest model
            currentInvestments = currentInvestments * (1 + 0.07 / 12); // 7% annual return
            currentSavings += monthlySavings;

            // Move excess savings to investments (simplified)
            if (currentSavings > state.expenses * 6) {
                const excess = currentSavings - (state.expenses * 6);
                currentSavings -= excess;
                currentInvestments += excess;
            }

            if (i % 12 === 0) {
                results.push({
                    month: i,
                    age: currentAge + Math.floor(i / 12),
                    savings: Math.round(currentSavings),
                    investments: Math.round(currentInvestments),
                    netWorth: Math.round(currentSavings + currentInvestments - state.debt),
                });
            }
        }
        setSimulationData(results);
    };

    useEffect(() => {
        runSimulation();
    }, [state]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">
                            Life Simulation
                        </h1>
                        <p className="text-muted-foreground">Visualize your financial future</p>
                    </div>
                    <Button variant="outline" onClick={() => setState(INITIAL_STATE)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </motion.div>

                <Timeline data={simulationData} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-primary w-5 h-5" />
                            <h3 className="font-bold">Income & Expenses</h3>
                        </div>
                        <Slider
                            label="Monthly Income"
                            valueDisplay={`$${state.income}`}
                            min={1000}
                            max={20000}
                            step={100}
                            value={state.income}
                            onChange={(e) => setState({ ...state, income: Number(e.target.value) })}
                        />
                        <Slider
                            label="Monthly Expenses"
                            valueDisplay={`$${state.expenses}`}
                            min={500}
                            max={15000}
                            step={100}
                            value={state.expenses}
                            onChange={(e) => setState({ ...state, expenses: Number(e.target.value) })}
                        />
                    </Card>

                    <Card className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Play className="text-primary w-5 h-5" />
                            <h3 className="font-bold">Assets</h3>
                        </div>
                        <Slider
                            label="Initial Savings"
                            valueDisplay={`$${state.savings}`}
                            min={0}
                            max={100000}
                            step={1000}
                            value={state.savings}
                            onChange={(e) => setState({ ...state, savings: Number(e.target.value) })}
                        />
                        <Slider
                            label="Initial Investments"
                            valueDisplay={`$${state.investments}`}
                            min={0}
                            max={200000}
                            step={1000}
                            value={state.investments}
                            onChange={(e) => setState({ ...state, investments: Number(e.target.value) })}
                        />
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <Gamification state={state} />
                <AIAdvisor state={state} />

                <Card variant="glass" className="p-4">
                    <h3 className="font-bold mb-4">Quick Scenarios</h3>
                    <div className="space-y-2">
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => setState(s => ({ ...s, income: s.income + 500 }))}
                        >
                            🚀 Side Hustle (+$500/mo)
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => setState(s => ({ ...s, expenses: s.expenses - 200 }))}
                        >
                            ☕ Cut Coffee (-$200/mo)
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => setState(s => ({ ...s, investments: s.investments + 5000 }))}
                        >
                            💰 Inheritance (+$5k)
                        </Button>
                    </div>
                </Card>

                <Card className="p-4 bg-primary/10 border-primary/20">
                    <h3 className="font-bold text-primary mb-2">Net Worth at 55</h3>
                    <p className="text-3xl font-bold">
                        ${simulationData[simulationData.length - 1]?.netWorth.toLocaleString()}
                    </p>
                </Card>
            </div>
        </div>
    );
};
