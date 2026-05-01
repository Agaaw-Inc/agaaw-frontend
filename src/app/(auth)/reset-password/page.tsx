import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <AuthCard>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthCard>
    );
}
