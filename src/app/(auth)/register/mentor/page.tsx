import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function MentorRegisterPage() {
    return (
        <AuthCard>
            <RegisterForm role="mentor" />
        </AuthCard>
    );
}
