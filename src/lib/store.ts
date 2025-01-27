import type {Action,ThunkAction} from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/features/users/userSlice";
import authReducer from "@/lib/features/auth/authSlice";

const rootReducer = combineSlices({
    user: userReducer,
    auth: authReducer
})

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;