import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    sidebarOpen: boolean;
    activeFilters: Record<string, string[]>;
}

const initialState: UiState = {
    sidebarOpen: true,
    activeFilters: {},
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen(state, action: PayloadAction<boolean>) {
            state.sidebarOpen = action.payload;
        },
        setFilter(state, action: PayloadAction<{ key: string; values: string[] }>) {
            state.activeFilters[action.payload.key] = action.payload.values;
        },
        clearFilters(state) {
            state.activeFilters = {};
        },
    },
});

export const { toggleSidebar, setSidebarOpen, setFilter, clearFilters } = uiSlice.actions;
export default uiSlice.reducer;
