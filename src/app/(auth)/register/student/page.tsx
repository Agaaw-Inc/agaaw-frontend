import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function StudentRegisterPage() {
    return (
        <AuthCard>
            <RegisterForm role="student" />
        </AuthCard>
    );
}
