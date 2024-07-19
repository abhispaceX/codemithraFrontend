
import authReducer from './authSlice'
import expenseReducer from './expenseSlice'
import summaryReducer from './summarySlice'
import { configureStore } from '@reduxjs/toolkit'

 const store = configureStore({
    reducer: {
      expenses: expenseReducer,
      summary: summaryReducer,
      auth:authReducer
    },
  });
  export default store
