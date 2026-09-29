"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { COUNTRIES, countryMatches, findCountry, type CountryOption } from "@/lib/countries";

/**
 * The one country picker used by every form that asks for a country.
 *
 * - Type to filter (accent-insensitive; names that start with the text come
 *   first), ↑/↓ to move, Enter to pick, Esc to close.
 * - Stores the country NAME (see lib/countries.ts for why).
 * - A value that isn't a known country (typed into the old free-text field)
 *   is still shown, so editing an old profile never silently blanks it.
 */

type Variant = "default" | "onboarding";

interface CommonProps {
    /** Limit the choices, e.g. to countries Agaaw has pages for. Defaults to every country. */
    options?: CountryOption[];
    placeholder?: string;
    disabled?: boolean;
    variant?: Variant;
    id?: string;
    "aria-label"?: string;
}

const FIELD: Record<Variant, string> = {
    default:
        "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500",
    onboarding:
        "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10",
};

const LIST_MAX_HEIGHT = 240;

/** Resolve a stored value to an option, keeping unknown legacy text visible. */
function toOption(value: string): CountryOption {
    return findCountry(value) ?? { code: "", name: value, flag: "" };
}

// ─── Shared engine: search, keyboard, floating list ──────────

interface FieldRenderProps {
    open: boolean;
    query: string;
    /** Spread onto the <input>. */
    inputProps: React.InputHTMLAttributes<HTMLInputElement> & { role: "combobox" };
}

interface ComboboxProps {
    options: CountryOption[];
    /** Names to leave out of the list (already chosen in multi-select). */
    exclude: string[];
    /** Name to tick in the list. */
    selected?: string;
    closeOnPick: boolean;
    onPick: (c: CountryOption) => void;
    onBackspaceEmpty?: () => void;
    disabled?: boolean;
    id?: string;
    ariaLabel?: string;
    className: string;
    children: (field: FieldRenderProps) => ReactNode;
}

function Combobox({
    options,
    exclude,
    selected,
    closeOnPick,
    onPick,
    onBackspaceEmpty,
    disabled,
    id,
    ariaLabel,
    className,
    children,
}: ComboboxProps) {
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number } | null>(null);

    const filtered = useMemo(() => {
        const skip = new Set(exclude);
        const hits = options.filter((c) => !skip.has(c.name) && countryMatches(c, query));
        const q = query.trim().toLowerCase();
        if (!q) return hits;
        // "ban" → Bangladesh before Albania.
        const rank = (c: CountryOption) => (c.name.toLowerCase().startsWith(q) ? 0 : 1);
        return [...hits].sort((a, b) => rank(a) - rank(b));
    }, [options, exclude, query]);

    // Close when clicking anywhere outside the field and its list.
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    // The list lives in <body> with fixed positioning so a modal's scrollable
    // body can't clip it. Track the field; open upward if there's no room below.
    useLayoutEffect(() => {
        if (!open) return;
        const place = () => {
            const r = rootRef.current?.getBoundingClientRect();
            if (!r) return;
            const below = window.innerHeight - r.bottom;
            setPos(
                below < LIST_MAX_HEIGHT + 16 && r.top > below
                    ? { left: r.left, width: r.width, bottom: window.innerHeight - r.top + 8 }
                    : { left: r.left, width: r.width, top: r.bottom + 8 },
            );
        };
        place();
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true); // capture: scrolling inside modals too
        return () => {
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
    }, [open]);

    // Keep the highlighted row visible while arrowing through a long list.
    useEffect(() => {
        listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [active]);

    const pick = (c: CountryOption) => {
        onPick(c);
        setQuery("");
        setActive(0);
        if (closeOnPick) setOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            if (open && filtered[active]) {
                e.preventDefault();
                pick(filtered[active]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        } else if (e.key === "Backspace" && !query) {
            onBackspaceEmpty?.();
        }
    };

    const inputProps: FieldRenderProps["inputProps"] = {
        id,
        role: "combobox",
        "aria-expanded": open,
        "aria-controls": listId,
        "aria-autocomplete": "list",
        "aria-activedescendant": open && filtered[active] ? `${listId}-${active}` : undefined,
        "aria-label": ariaLabel,
        disabled,
        autoComplete: "off",
        onFocus: () => setOpen(true),
        onChange: (e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
        },
        onKeyDown,
    };

    return (
        <div ref={rootRef} className="relative">
            <div className={`${className} ${disabled ? "opacity-50" : ""}`}>{children({ open, query, inputProps })}</div>

            {open &&
                pos &&
                createPortal(
                    <ul
                        id={listId}
                        ref={listRef}
                        role="listbox"
                        style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: LIST_MAX_HEIGHT }}
                        className="fixed z-[1000] overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-4 py-2.5 text-sm text-gray-400">No country matches “{query}”</li>
                        ) : (
                            filtered.map((c, i) => (
                                <li
                                    key={c.code || c.name}
                                    id={`${listId}-${i}`}
                                    data-index={i}
                                    role="option"
                                    aria-selected={c.name === selected}
                                    onMouseDown={(e) => e.preventDefault()} // keep input focus
                                    onClick={() => pick(c)}
                                    onMouseEnter={() => setActive(i)}
                                    className={`flex cursor-pointer items-center gap-2.5 px-4 py-2 text-sm ${
                                        i === active ? "bg-teal-50 text-teal-800" : "text-gray-700"
                                    }`}
                                >
                                    <span className="w-5 text-base leading-none" aria-hidden>
                                        {c.flag}
                                    </span>
                                    <span className="flex-1">{c.name}</span>
                                    {c.name === selected && <Check size={14} className="text-teal-600" />}
                                </li>
                            ))
                        )}
                    </ul>,
                    document.body,
                )}
        </div>
    );
}

// ─── Single country ──────────────────────────────────────────

interface CountrySelectProps extends CommonProps {
    value: string;
    onChange: (name: string) => void;
    /** Show a clear (×) button. */
    clearable?: boolean;
}

export default function CountrySelect({
    value,
    onChange,
    options = COUNTRIES,
    placeholder = "Select a country",
    disabled,
    clearable = true,
    variant = "default",
    id,
    "aria-label": ariaLabel,
}: CountrySelectProps) {
    const current = value ? toOption(value) : null;

    return (
        <Combobox
            options={options}
            exclude={[]}
            selected={current?.name}
            closeOnPick
            onPick={(c) => onChange(c.name)}
            disabled={disabled}
            id={id}
            ariaLabel={ariaLabel}
            className={`flex items-center gap-2 ${FIELD[variant]}`}
        >
            {({ open, query, inputProps }) => (
                <>
                    <span className="w-5 shrink-0 text-base leading-none" aria-hidden>
                        {current?.flag || <Globe size={16} className="text-gray-400" />}
                    </span>
                    <input
                        {...inputProps}
                        value={open ? query : current?.name ?? ""}
                        placeholder={open && current ? current.name : placeholder}
                        className="min-w-0 flex-1 bg-transparent outline-none placeholder:font-normal placeholder:text-gray-400"
                    />
                    {clearable && value && !disabled ? (
                        <button type="button" onClick={() => onChange("")} className="text-gray-400 hover:text-gray-600" aria-label="Clear country">
                            <X size={15} />
                        </button>
                    ) : (
                        <ChevronDown size={16} className="pointer-events-none shrink-0 text-gray-400" />
                    )}
                </>
            )}
        </Combobox>
    );
}

// ─── Several countries ───────────────────────────────────────

interface CountryMultiSelectProps extends CommonProps {
    values: string[];
    onChange: (names: string[]) => void;
    max?: number;
}

export function CountryMultiSelect({
    values,
    onChange,
    options = COUNTRIES,
    placeholder = "Add a country…",
    disabled,
    max,
    variant = "default",
    id,
    "aria-label": ariaLabel,
}: CountryMultiSelectProps) {
    const chosen = values.map(toOption);
    const full = max !== undefined && values.length >= max;

    return (
        <Combobox
            options={options}
            exclude={values}
            closeOnPick={false}
            onPick={(c) => onChange([...values, c.name])}
            onBackspaceEmpty={() => values.length && onChange(values.slice(0, -1))}
            disabled={disabled}
            id={id}
            ariaLabel={ariaLabel}
            className={`flex flex-wrap items-center gap-1.5 ${FIELD[variant]}`}
        >
            {({ query, inputProps }) => (
                <>
                    {chosen.map((c) => (
                        <span key={c.name} className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
                            {c.flag && <span aria-hidden>{c.flag}</span>}
                            {c.name}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => onChange(values.filter((v) => v !== c.name))}
                                    className="text-teal-600 hover:text-teal-900"
                                    aria-label={`Remove ${c.name}`}
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </span>
                    ))}
                    {!full && (
                        <input
                            {...inputProps}
                            value={query}
                            placeholder={values.length ? "" : placeholder}
                            className="min-w-[8rem] flex-1 bg-transparent py-0.5 outline-none placeholder:font-normal placeholder:text-gray-400"
                        />
                    )}
                </>
            )}
        </Combobox>
    );
}
