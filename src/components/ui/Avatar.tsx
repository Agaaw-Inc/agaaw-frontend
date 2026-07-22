"use client";

import { useEffect, useState } from "react";

interface AvatarProps {
    src?: string | null;
    /** Fallback text shown (first 2 chars) when there's no image or it fails to load. */
    name: string;
    /** Image alt text, if it should differ from `name` (e.g. name is precomputed initials). */
    alt?: string;
    /** Applied to the <img> itself. Caller owns the sizing/shape wrapper. */
    className?: string;
    /** Applied to the fallback initials text, for sites that style it beyond what the wrapper provides. */
    fallbackClassName?: string;
}

/**
 * Drop-in replacement for the `{src ? <img/> : initials}` pattern used
 * across the app. Falls back to initials both when `src` is empty and when
 * the image fails to load (e.g. the file was removed from disk but the
 * DB/URL still references it) — plain `<img>` has no such fallback.
 */
export default function Avatar({ src, name, alt, className = "w-full h-full object-cover", fallbackClassName }: AvatarProps) {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    if (!src || failed) {
        const initials = name?.trim().substring(0, 2);
        return fallbackClassName ? <div className={fallbackClassName}>{initials}</div> : <>{initials}</>;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? name} className={className} onError={() => setFailed(true)} />
    );
}
