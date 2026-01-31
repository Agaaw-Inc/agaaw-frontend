// app/register/student/page.tsx

import Card from "@/components/ui/Card";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export default function StudentRegisterPage() {
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

      {/* REGISTER CARD */}
      <Card className="backdrop-blur-md bg-white border-bombay">
        <RegisterForm role="student" />
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
