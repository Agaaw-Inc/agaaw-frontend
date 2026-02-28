"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { registrationData } from "@/lib/mock/dashboardData";
import TimeFilter from "./TimeFilter";
import { motion } from "framer-motion";

export default function RegistrationChart() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">("monthly");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">User Registrations</h3>
        <TimeFilter value={filter} onChange={(val) => setFilter(val as "weekly" | "monthly" | "yearly")} />
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={registrationData[filter]}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Line type="monotone" dataKey="students" stroke="#635bff" strokeWidth={3} />
            <Line type="monotone" dataKey="mentors" stroke="#0ea5e9" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}