import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses, deleteExpense, updateExpense } from '../Redux/expenseSlice';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const [show, setShow] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [editedExpense, setEditedExpense] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteExpense(id))
      .unwrap()
      .then(() => {
        console.log('Expense deleted successfully');
      })
      .catch((error) => {
        console.error('Failed to delete expense:', error);
      });
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setEditedExpense({
      date: new Date(expense.date).toISOString().split('T')[0],
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
    });
    setShow(true);
  };

  const handleSave = () => {
    dispatch(updateExpense({ id: currentExpense._id, ...editedExpense }))
      .unwrap()
      .then(() => {
        console.log('Expense updated successfully');
        setShow(false);
      })
      .catch((error) => {
        console.error('Failed to update expense:', error);
      });
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-primary">Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">{expense.category}</td>
                <td className="py-3 px-6 text-left">${expense.amount.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Expense Modal */}
      {show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Expense
                    </h3>
                    <div className="mt-2">
                      <form>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            value={editedExpense.date}
                            onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            value={editedExpense.amount}
                            onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            Category
                          </label>
                          <input
                            type="text"
                            id="category"
                            value={editedExpense.category}
                            onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                          </label>
                          <input
                            type="text"
                            id="description"
                            value={editedExpense.description}
                            onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSave}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
