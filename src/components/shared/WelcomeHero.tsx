"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { getUserInfo, setUserInfo } from "@/lib/auth";
import { getMe } from "@/lib/api";

interface WelcomeHeroProps {
  role: "student" | "mentor";
}

export default function WelcomeHero({ role }: WelcomeHeroProps) {
  const [text, setText] = useState("");
  const [userName, setUserName] = useState<string>("");
  const fullText = "You are welcome and your dashboard will be ready soon.";

  useEffect(() => {
    const user = getUserInfo();
    if (user && user.firstName) {
      setUserName(user.firstName);
    } else {
      // Try to fetch from API if not in localStorage
      getMe()
        .then((userData) => {
          setUserInfo(userData);
          setUserName(userData.firstName);
        })
        .catch(() => {
          setUserName(role);
        });
    }
  }, [role]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-white px-6 py-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[100px] opacity-60"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[100px] opacity-60"
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-8 border border-teal-100 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Welcome to the Future of Agaaw</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
          Hello, <span className="text-teal-600 capitalize">{userName}</span>!
          <br />
          <span className="inline-block min-h-[1.2em]">
            {text}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-12 md:h-16 bg-teal-600 ml-1 align-middle"
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We're putting the finishing touches on your personalized workspace. In the meantime, discover opportunities waiting for you below.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6"
        >
        </motion.div>
      </div>
    </section>
  );
}
