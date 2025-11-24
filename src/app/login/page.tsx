// app/login/page.tsx

import Card from "@/components/ui/Card";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/authBack.PNG"
        alt="Background"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      {/* LOGIN CARD */}
      <Card className="backdrop-blur-md bg-white border-bombay">
        <LoginForm />
      </Card>

      {/* BACK TO HOME */}
      <Link
        href="/"
        className="text-center text-sm text-bombay hover:underline mt-4"
      >
        Back to Home
      </Link>
    </div>
  );
}
