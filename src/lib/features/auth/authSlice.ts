import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    user: null | {email: string},
    token: string | null,
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'AuthState',
    initialState,
    reducers: {
        setCredentials: (state,action: PayloadAction<{user: {email: string}, token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;