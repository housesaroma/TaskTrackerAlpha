import {Action, configureStore, createSlice, ThunkAction} from '@reduxjs/toolkit';
import authReducer from './store/auth/authSlice.ts';

interface ThemeState {
    currentTheme: 'light' | 'dark';
}

const initialState: ThemeState = {
    currentTheme: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        },
    },
});

export const {toggleTheme} = themeSlice.actions;

export const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;