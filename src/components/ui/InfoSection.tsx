interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function InfoSection({ title, children }: InfoSectionProps) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <div className="bg-white rounded-lg shadow p-5 text-gray-700">
                {children}
            </div>
        </section>
    );
}