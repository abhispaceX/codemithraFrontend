import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSummary = createAsyncThunk(
  'summary/fetchSummary',
  async ({ startDate, endDate, period }, { rejectWithValue }) => {
    try {
      console.log('Fetching summary for:', startDate, 'to', endDate, 'period:', period);
      const response = await axios.get(`https://ethnusbackend-fuxl.onrender.com`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          period
        }
      });
      console.log('Raw API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      return rejectWithValue(error.message);
    }
  }
);

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    totalSpending: 0,
    spendingByCategory: {},
    spendingByPeriod: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        console.log('Updating summary state with:', action.payload);
        state.loading = false;
        state.totalSpending = action.payload.totalSpending || 0;
        state.spendingByCategory = action.payload.spendingByCategory || {};
        state.spendingByPeriod = action.payload.spendingByPeriod || {};
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export default summarySlice.reducer;