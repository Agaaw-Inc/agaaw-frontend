/**
 * Every country, from the ISO 3166-1 standard via `i18n-iso-countries`,
 * instead of a hand-typed list. The package is maintained upstream (new or
 * renamed countries arrive with an `npm update`) and the English data is ~8 KB.
 *
 * We store the display NAME (e.g. "Bangladesh") in profiles, not the code,
 * because that's what existing rows already hold and what the UI shows.
 * `findCountry` maps older free-text values ("UAE", "USA", "Bangladeshi")
 * onto the canonical entry so editing an old profile still works.
 */

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export interface CountryOption {
    /** ISO 3166-1 alpha-2, e.g. "BD". */
    code: string;
    /** The name we show and store, e.g. "United States". */
    name: string;
    flag: string;
}

// Where neither the official name nor the package's short alias reads well.
const NAME_OVERRIDES: Record<string, string> = {
    GB: "United Kingdom",
    CD: "DR Congo", // the alias would be "Congo" — same as CG
    CG: "Republic of the Congo",
    FM: "Micronesia",
    MD: "Moldova",
    VA: "Vatican City",
    FK: "Falkland Islands",
    CC: "Cocos (Keeling) Islands",
    VG: "British Virgin Islands",
    VI: "U.S. Virgin Islands",
};

// Values people typed into the old free-text fields.
const LEGACY_ALIASES: Record<string, string> = {
    uae: "AE",
    usa: "US",
    us: "US",
    uk: "GB",
    england: "GB",
    "south korea": "KR",
    korea: "KR",
    bangladeshi: "BD",
    indian: "IN",
    pakistani: "PK",
    nepali: "NP",
    american: "US",
    british: "GB",
    canadian: "CA",
    australian: "AU",
    german: "DE",
};

/** Turns "BD" into 🇧🇩 using the two regional-indicator letters. */
function flagEmoji(code: string): string {
    return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

const official = countries.getNames("en", { select: "official" });
const alias = countries.getNames("en", { select: "alias" });

export const COUNTRIES: CountryOption[] = Object.keys(official)
    .map((code) => {
        const short = alias[code];
        // Prefer the everyday form ("Iran", "Russia") unless it's just an
        // abbreviation ("UK") or a formal "Korea, Republic of" form.
        const name =
            NAME_OVERRIDES[code] ??
            (short && short.length > 3 && !short.includes(",") ? short : official[code]);
        return { code, name, flag: flagEmoji(code) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

const byLowerName = new Map<string, CountryOption>();
for (const c of COUNTRIES) {
    byLowerName.set(c.name.toLowerCase(), c);
    byLowerName.set(official[c.code].toLowerCase(), c);
    for (const n of countries.getNames("en", { select: "all" })[c.code] ?? []) {
        byLowerName.set(n.toLowerCase(), c);
    }
}
const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));

/** Resolve a stored name, ISO code, or legacy free-text value to a country. */
export function findCountry(value: string | null | undefined): CountryOption | undefined {
    const v = value?.trim();
    if (!v) return undefined;
    const lower = v.toLowerCase();
    return (
        byLowerName.get(lower) ??
        (LEGACY_ALIASES[lower] ? byCode.get(LEGACY_ALIASES[lower]) : undefined) ??
        (v.length === 2 ? byCode.get(v.toUpperCase()) : undefined)
    );
}

/** Case- and accent-insensitive match for the search box ("cote" finds "Côte d'Ivoire"). */
export function countryMatches(country: CountryOption, query: string): boolean {
    const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const q = norm(query.trim());
    if (!q) return true;
    return norm(country.name).includes(q) || country.code.toLowerCase() === q;
}
