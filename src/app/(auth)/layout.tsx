import AuthBackground from "@/components/auth/AuthBackground";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex items-stretch overflow-hidden">
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}