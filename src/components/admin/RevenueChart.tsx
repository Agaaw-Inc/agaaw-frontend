"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { revenueData } from "@/lib/mock/dashboardData";
import TimeFilter from "./TimeFilter";
import { motion } from "framer-motion";

export default function RevenueChart() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("monthly");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Revenue Growth</h3>
        <TimeFilter value={filter} onChange={(val) => setFilter(val as "weekly" | "monthly" | "yearly")} />
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData[filter]}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#635bff"
              fill="#635bff"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}