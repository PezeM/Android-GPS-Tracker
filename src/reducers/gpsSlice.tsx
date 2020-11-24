import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LatLngInterface} from "../types/gps.interfaces";
import {RootState} from "./index";

interface GpsSliceState {
    savedCoordinates?: LatLngInterface[];
    trackingStarted: boolean;
}

const initialState: GpsSliceState = {
    savedCoordinates: undefined,
    trackingStarted: false
}

const gpsSlice = createSlice({
    name: 'gpsSlice',
    initialState,
    reducers: {
        setTrackingState: (state, action: PayloadAction<boolean>) => {
            state.trackingStarted = action.payload;
        },
        clearGpsCoordinates: (state, action) => {
            console.log('Clearing');
            state.savedCoordinates = undefined;
        },
        addGpsCoordinate: (state, action: PayloadAction<LatLngInterface>) => {
            if (!state.savedCoordinates) {
                state.savedCoordinates = [];
            }

            if (!state.trackingStarted) {
                state.trackingStarted = true;
            }

            const last = state.savedCoordinates[state.savedCoordinates.length - 1];
            if (last &&
                last.lat === action.payload.lat &&
                last.lng === action.payload.lng) {
                return;
            }

            state.savedCoordinates.push(action.payload);
        }
    }
});

export const {setTrackingState, clearGpsCoordinates, addGpsCoordinate} = gpsSlice.actions;

export default gpsSlice.reducer;

export const selectSavedCoordinates = (state: RootState) => state.gps.savedCoordinates;
export const selectAnySavedCoordinates = (state: RootState) => state.gps.savedCoordinates !== undefined;
export const selectIsTrackingStarted = (state: RootState) => state.gps.trackingStarted;