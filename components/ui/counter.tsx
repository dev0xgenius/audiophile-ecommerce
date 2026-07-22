"use client"

import { cn } from "@/lib/utils";

interface CounterProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export function Counter({ value, onChange, min = 1, max = 99, className }: CounterProps) {
    return (
        <span className={cn("flex justify-between items-center bg-gray w-[120px] h-8", className)}>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary disabled:text-gray transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span className="text-sm font-bold tracking-widest" aria-live="polite">{value}</span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="flex-1 h-full text-sm font-bold tracking-widest uppercase text-accent-foreground hover:text-primary disabled:text-gray transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded-sm outline-none"
                aria-label="Increase quantity"
            >
                +
            </button>
        </span>
    );
}
