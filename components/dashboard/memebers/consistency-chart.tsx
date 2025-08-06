// components/consistency-chart.tsx
"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface ConsistencyChartProps {
    data: { date: string; consistency: number }[];
}

export const ConsistencyChart = ({ data }: ConsistencyChartProps) => {
    // Calculate percentage change
    let consistencyPercentage = 0;
    if (data.length >= 2) {
        const lastWeek = data[data.length - 1].consistency;
        const prevWeek = data[data.length - 2].consistency;
        const change = ((lastWeek - prevWeek) / prevWeek) * 100;
        consistencyPercentage = parseFloat(change.toFixed(1));
    } else if (data.length === 1) {
        consistencyPercentage = data[0].consistency * 100;
    }

    return (
        <div className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Meal Consistency Trend</h3>
                {consistencyPercentage !== 0 && (
                    <div className={`flex items-center ${consistencyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {consistencyPercentage >= 0 ? (
                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                            <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        <span>{Math.abs(consistencyPercentage)}%</span>
                        <span className="text-gray-500 text-sm ml-1">
                            {consistencyPercentage >= 0 ? 'increase' : 'decrease'} from last week
                        </span>
                    </div>
                )}
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => {
                                const d = new Date(date);
                                return `${d.getMonth() + 1}/${d.getDate()}`;
                            }}
                        />
                        <YAxis
                            domain={[0, 1]}
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}% consistency`, 'Consistency']}
                            labelFormatter={(date) => `Week of ${new Date(date).toLocaleDateString()}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="consistency"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};