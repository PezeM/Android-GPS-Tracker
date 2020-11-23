import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import rootReducer, {RootState} from './reducers/index';
import {useDispatch} from 'react-redux';

export const store = configureStore({
    reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;