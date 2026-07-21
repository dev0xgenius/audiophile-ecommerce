"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/app/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>(undefined);

    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    // eslint-disable-next-line react-hooks/refs
    return <Provider store={storeRef.current}>{children}</Provider>;
}
