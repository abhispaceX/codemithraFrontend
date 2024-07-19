import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSummary } from '../Redux/summarySlice';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const Summary = () => {
  const dispatch = useDispatch();
  const { totalSpending, spendingByCategory, loading, error } = useSelector((state) => state.summary);

  useEffect(() => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    console.log('Dispatching fetchSummary with dates:', startDate, endDate);
    dispatch(fetchSummary({ startDate, endDate }));
  }, [dispatch]);

  const chartData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log('Summary data:', totalSpending, spendingByCategory);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-primary">Summary</h2>
      <p className="text-xl mb-4">Total Spending: <span className="font-bold text-secondary">${totalSpending.toFixed(2)}</span></p>
      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No data available for the selected period.</p>
      )}
    </div>
  );
};

export default Summary;