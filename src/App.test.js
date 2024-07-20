import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './Redux/Store';
import '@testing-library/jest-dom';
import ExpenseForm from './components/ExpenseForm';

test('renders expense form correctly', () => {
  render(
    <Provider store={store}>
      <ExpenseForm />
    </Provider>
  );

  // Check for the heading
  expect(screen.getByRole('heading', { name: /add expense/i })).toBeInTheDocument();

  // Check for the form inputs
  expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();

  // Check for the submit button
  expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
});
test('opens edit modal when edit button is clicked', () => {
  render(
    <Provider store={store}>
      <ExpenseList />
    </Provider>
  );

  const editButtons = screen.getAllByText('Edit');
  fireEvent.click(editButtons[0]);

  expect(screen.getByText('Edit Expense')).toBeInTheDocument();
});
