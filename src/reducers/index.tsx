import {combineReducers} from "@reduxjs/toolkit";
import gpsReducer from './gpsSlice';

const rootReducer = combineReducers({
    gps: gpsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;