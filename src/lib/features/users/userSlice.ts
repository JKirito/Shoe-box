import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number;
    name: string;
    email: string;
    isAuthenticated: boolean;
}

const initialState: User = {
    id: 0,
    name: '',
    email: '',
    isAuthenticated: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => {
            return action.payload;
        },
        clearUser: (_state) => {
            return initialState;
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;