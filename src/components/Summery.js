import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSummary } from '../Redux/summarySlice';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Summary = () => {
  const dispatch = useDispatch();
  const { totalSpending, spendingByCategory, spendingByPeriod, loading, error } = useSelector((state) => state.summary);
  const expenses = useSelector((state) => state.expenses.items);
  const debouncedExpenses = useDebounce(expenses, 300);

  const [period, setPeriod] = useState('monthly');

  const fetchSummaryData = useCallback(() => {
    const endDate = new Date();
    let startDate = new Date();
    switch (period) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 90); // Last 13 weeks
        break;
      case 'monthly':
      default:
        startDate.setFullYear(startDate.getFullYear() - 1); // Last 12 months
    }
    console.log('Dispatching fetchSummary with dates:', startDate, endDate, 'period:', period);
    dispatch(fetchSummary({ startDate, endDate, period }));
  }, [dispatch, period]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData, debouncedExpenses, period]);

  const chartData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const lineChartData = Object.entries(spendingByPeriod).map(([date, value]) => ({ date, value }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-primary">Summary</h2>
      <div className="mb-4">
        <label className="mr-2">Period:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border rounded p-1">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <p className="text-xl mb-4">Total Spending: <span className="font-bold text-secondary">${totalSpending.toFixed(2)}</span></p>
      
      <h3 className="text-xl mb-2">Spending by Category</h3>
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
        <p>No category data available for the selected period.</p>
      )}

      <h3 className="text-xl mb-2 mt-4">Spending Over Time</h3>
      {lineChartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No time series data available for the selected period.</p>
      )}
    </div>
  );
};

export default Summary;