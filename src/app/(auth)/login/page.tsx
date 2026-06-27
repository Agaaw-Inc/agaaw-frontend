import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthCard>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </AuthCard>
    );
}
