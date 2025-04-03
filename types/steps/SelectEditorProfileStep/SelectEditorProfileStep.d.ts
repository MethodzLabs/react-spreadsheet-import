export type Profile = {
    id?: string;
    organizationId?: string;
    name?: string | undefined;
    type?: string | undefined;
    themes: string | undefined;
    languages: string | undefined;
    targetCountries: string | undefined;
    linkType: "DO_FOLLOW" | "NO_FOLLOW" | "BOTH" | undefined;
    nbMaxLinksClient: number | undefined;
    nbMaxLinksExternal: number | undefined;
    nbWords: number | undefined;
    sponso: "SPONSO" | "NO_SPONSO" | "BOTH" | undefined;
    isPrivate: string | undefined;
    isGoogleNews: string | undefined;
    validityDuration: "FOREVER" | "SIX_MONTHS" | "TWELVE_MONTHS" | "TWENTY_FOUR_MONTHS" | undefined;
    category: "IMPOSED" | "IMPOSED_CATEGORY" | "NOT_IMPOSED" | undefined;
    categoryUrl: string | undefined;
    redactionType: "HUMAN" | "AI" | "MIXED" | undefined;
    priceWithoutRedaction: number | undefined;
    priceWithRedaction: number | undefined;
    additionnalPriceRedaction: number | undefined;
    additionnalPriceCrypto: number | undefined;
    additionnalPriceHealth: number | undefined;
    additionnalPriceCBD: number | undefined;
    additionnalPriceSex: number | undefined;
    additionnalPriceFinance: number | undefined;
    additionnalPriceCasino: number | undefined;
    additionalPriceSponso: number | undefined;
    additionalPriceDofollow: number | undefined;
    pricePer100Words: number | undefined;
};
type SelectEditorProfileStepProps = {
    onContinue: (profile: Profile) => Promise<void>;
    organization: any;
    onBack?: () => void;
};
export declare const SelectEditorProfileStep: ({ onContinue, organization, onBack }: SelectEditorProfileStepProps) => import("react/jsx-runtime").JSX.Element;
export {};
