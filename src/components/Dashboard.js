import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Summary from './Summery';
import { logout } from '../Redux/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Dispatch an action to update the Redux store
    dispatch(logout() );
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Personal Expense Tracker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ExpenseForm />
          <ExpenseList />
        </div>
        <div>
          <Summary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;