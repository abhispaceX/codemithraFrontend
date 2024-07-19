import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://ethnusbackend-fuxl.onrender.com/api/expenses';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, expense);
      dispatch(expenseAdded(response.data)); // Update local state
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, ...expense }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, expense);
      return response.data;
    } catch (error) {
      console.error('Error updating expense:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    expenseAdded: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        // This case is now redundant as we're using the expenseAdded reducer
        // but we'll keep it for consistency
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((expense) => expense._id !== action.payload);
      });
  },
});

export const { expenseAdded } = expenseSlice.actions;
export default expenseSlice.reducer;