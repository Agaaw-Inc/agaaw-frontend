"use client";

import { useEffect, useState } from "react";
import { getOrderConfig, type OrderPricingConfig } from "@/lib/orders";

/**
 * The commission rate etc. come from the backend so there is one source of
 * truth. Until it loads (or if it fails) we fall back to the launch values,
 * which only affects previews — the server always computes the real split.
 */
const FALLBACK: OrderPricingConfig = {
    commissionRate: 0.1,
    currency: "BDT",
    disputeWindowHours: 120,
    minPayout: "500.00",
};

let cached: Promise<OrderPricingConfig> | null = null;

export function useOrderConfig(): OrderPricingConfig {
    const [config, setConfig] = useState<OrderPricingConfig>(FALLBACK);

    useEffect(() => {
        let alive = true;
        cached ??= getOrderConfig().catch(() => {
            cached = null; // retry on the next mount
            return FALLBACK;
        });
        cached.then((c) => alive && setConfig(c));
        return () => {
            alive = false;
        };
    }, []);

    return config;
}
