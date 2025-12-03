import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from './user/signUpSlice';
import logInReducer from './user/logInSlice';
import pulseLogReducer from './pulseLogs/pulseLogSlice';
import teamReducer from './teams/teamSlice';
import moodWorkloadReducer from './moodWorkload/moodWorkloadSlice';

const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    logIn: logInReducer,
    pulseLogs: pulseLogReducer,
    teams: teamReducer,
    moodWorkload: moodWorkloadReducer,
  },
});

export default store;