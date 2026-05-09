"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { registrationData } from "@/lib/mock/dashboardData";
import TimeFilter from "./TimeFilter";
import { motion } from "framer-motion";

interface RegistrationChartProps {
  data?: { date: string; count: number }[];
  isLoading?: boolean;
}

export default function RegistrationChart({ data, isLoading }: RegistrationChartProps) {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Use real data if provided, else fallback to mock for now
  const chartData = data ? data.map(d => ({
    name: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    total: d.count
  })) : registrationData[filter];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[410px] animate-pulse">
        <div className="h-6 w-40 bg-gray-100 rounded mb-6" />
        <div className="h-full bg-gray-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">User Registrations</h3>
          <p className="text-xs text-gray-400">Total new accounts per day (Last 30 days)</p>
        </div>
        {!data && <TimeFilter value={filter} onChange={(val) => setFilter(val as any)} />}
      </div>

      <motion.div
        key={data ? 'real' : filter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey={data ? "total" : "students"} 
              stroke="#0f766e" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#0f766e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            {!data && <Line type="monotone" dataKey="mentors" stroke="#0ea5e9" strokeWidth={3} />}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}