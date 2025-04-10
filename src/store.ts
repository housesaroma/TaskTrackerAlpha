import {configureStore, createSlice} from '@reduxjs/toolkit';

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

export const { toggleTheme } = themeSlice.actions;

export const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;