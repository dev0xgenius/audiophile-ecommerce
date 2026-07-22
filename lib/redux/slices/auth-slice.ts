import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Permission {
    resource: string;
    action: string;
}

interface AuthState {
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    permissions: Permission[];
    isLoaded: boolean;
}

const initialState: AuthState = {
    userId: null,
    userName: null,
    userEmail: null,
    permissions: [],
    isLoaded: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ id: string; name: string | null; email: string | null; permissions: Permission[] }>) {
            state.userId = action.payload.id;
            state.userName = action.payload.name;
            state.userEmail = action.payload.email;
            state.permissions = action.payload.permissions;
            state.isLoaded = true;
        },
        clearUser(state) {
            state.userId = null;
            state.userName = null;
            state.userEmail = null;
            state.permissions = [];
            state.isLoaded = true;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
