import { configureStore } from '@reduxjs/toolkit';
import signUpSlice from './user/logInSlice';
import logInSlice from './user/logInSlice';
import pulseLogReducer from './pulseLogs/pulseLogSlice'

const store = configureStore({
  reducer: {
    signUp: signUpSlice,
    logIn: logInSlice,
    pulseLogs: pulseLogReducer,
  },
});

export default store;