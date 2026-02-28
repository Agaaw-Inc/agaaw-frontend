"use client";

import { useState } from "react";

export default function DeleteButton({
    itemName,
    deleteAction,
}: {
    itemName: string;
    deleteAction: () => Promise<void>;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteAction();
        } catch (error) {
            alert("Failed to delete. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:underline disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}