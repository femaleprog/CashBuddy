import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';
import { type SimulationResult } from '../types';

interface TimelineProps {
    data: SimulationResult[];
}

export const Timeline: React.FC<TimelineProps> = ({ data }) => {
    return (
        <Card variant="glass" className="h-[400px] w-full p-4">
            <h3 className="text-xl font-bold mb-4 text-primary">Financial Projection</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="age" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorNetWorth)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};
