"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
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
          Welcome Back
        </p>

        <p className="text-xs text-bombay/80 mt-1 leading-none">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-codgray">Email</label>
          <Input placeholder="Enter your email" type="email" />
        </div>

        <div>
          <label className="text-sm font-medium text-codgray">Password</label>
          <Input placeholder="Enter your password" type="password" />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button className="w-1/4 flex justify-center items-center">
          Sign In
        </Button>
      </div>
    </div>
  );
}
