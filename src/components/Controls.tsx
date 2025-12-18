import React from 'react';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { type FinancialState } from '../types';
import { Wallet, CreditCard, PiggyBank } from 'lucide-react';

interface ControlsProps {
    state: FinancialState;
    onChange: (newState: FinancialState) => void;
    onInteractionStart?: (category: string) => void;
    onInteractionEnd?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ state, onChange, onInteractionStart, onInteractionEnd }) => {
    const updateState = (key: keyof FinancialState, value: number) => {
        onChange({ ...state, [key]: value });
    };

    return (
        <div className="space-y-4">
            <Card className="p-4 space-y-4 border-border/50 bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Wallet className="w-5 h-5" />
                    <h3 className="font-bold">Income</h3>
                </div>
                <Slider
                    label="Monthly Net Income"
                    valueDisplay={`€${state.income}`}
                    min={1000}
                    max={10000}
                    step={100}
                    value={state.income}
                    onChange={(e) => updateState('income', Number(e.target.value))}
                    onMouseDown={() => onInteractionStart?.('Income')}
                    onMouseUp={onInteractionEnd}
                />
            </Card>

            <Card className="p-4 space-y-4 border-border/50 bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-destructive">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="font-bold">Fixed Costs</h3>
                </div>
                <Slider
                    label="Rent & Bills"
                    valueDisplay={`€${state.expenses}`}
                    min={500}
                    max={5000}
                    step={50}
                    value={state.expenses}
                    onChange={(e) => updateState('expenses', Number(e.target.value))}
                    onMouseDown={() => onInteractionStart?.('Expenses')}
                    onMouseUp={onInteractionEnd}
                />
            </Card>

            <Card className="p-4 space-y-4 border-border/50 bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <PiggyBank className="w-5 h-5" />
                    <h3 className="font-bold">Assets</h3>
                </div>
                <Slider
                    label="Current Savings"
                    valueDisplay={`€${state.savings}`}
                    min={0}
                    max={50000}
                    step={500}
                    value={state.savings}
                    onChange={(e) => updateState('savings', Number(e.target.value))}
                    onMouseDown={() => onInteractionStart?.('Savings')}
                    onMouseUp={onInteractionEnd}
                />
                <Slider
                    label="Investments"
                    valueDisplay={`€${state.investments}`}
                    min={0}
                    max={100000}
                    step={1000}
                    value={state.investments}
                    onChange={(e) => updateState('investments', Number(e.target.value))}
                    onMouseDown={() => onInteractionStart?.('Investments')}
                    onMouseUp={onInteractionEnd}
                />
            </Card>
        </div>
    );
};
