"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function RegisterForm({ role }: { role: "student" | "mentor" }) {
  const router = useRouter();

  const roleLabel =
    role === "student" ? "Register as a Student" : "Register as a Mentor";

  // 🔥 GO TO DASHBOARD ON CLICK
  const handleRegister = () => {
    if (role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/dashboard/mentor");
    }
  };

  return (
    <div className="flex flex-col space-y-6">

      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-2">
        <Image
          src="/agaaw_logo_noBG.png"
          alt="Agaaw Logo"
          width={50}
          height={50}
          className="object-contain mb-1"
        />

        <span className="text-xl font-semibold text-codgray leading-none mb-2">
          Agaaw
        </span>

        <p className="text-sm text-bombay mt-1 leading-none">
          Create Account
        </p>

        <p className="text-xs text-bombay/80 mt-1 leading-none">
          {roleLabel}
        </p>
      </div>

      {/* Form Inputs */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-codgray">Full Name</label>
          <Input placeholder="Enter your full name" />
        </div>

        <div>
          <label className="text-sm font-medium text-codgray">Email</label>
          <Input placeholder="Enter your email" type="email" />
        </div>

        <div>
          <label className="text-sm font-medium text-codgray">Password</label>
          <Input placeholder="Create a password" type="password" />
        </div>

        <div>
          <label className="text-sm font-medium text-codgray">
            Confirm Password
          </label>
          <Input placeholder="Confirm your password" type="password" />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          className="w-1/2 flex justify-center items-center"
          onClick={handleRegister} 
        >
          Create Account
        </Button>
      </div>

    </div>
  );
}
