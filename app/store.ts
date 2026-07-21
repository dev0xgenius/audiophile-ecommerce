import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/lib/redux/slices/ui-slice";
import authReducer from "@/lib/redux/slices/auth-slice";

export const makeStore = () =>
    configureStore({
        reducer: {
            ui: uiReducer,
            auth: authReducer,
        },
        devTools: process.env.NODE_ENV !== "production",
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
