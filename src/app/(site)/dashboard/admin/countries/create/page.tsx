import CountryForm from "@/components/admin/CountryForm";

export default function CreateCountryPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Add New Country</h1>
            <CountryForm mode="create" />
        </div>
    );
}