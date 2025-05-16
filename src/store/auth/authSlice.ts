import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store.ts';
import * as authService from '../../services/auth.service';

interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.token = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;

// Thunk action для логина
export const login = (username: string, password: string): AppThunk => async (dispatch) => {
    try {
        console.log('Login thunk started with:', username, password);
        dispatch(loginStart());
        const { token } = await authService.authService.login({ username, password });
        localStorage.setItem('token', token);
        dispatch(loginSuccess(token));
    } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
};