import type { Columns } from "../MatchColumnsStep";
import type { Data, Fields, RawData } from "../../../types";
import { Profile } from "../../SelectEditorProfileStep/SelectEditorProfileStep";
export declare const normalizeTableData: <T extends string>(columns: Columns<T>, data: RawData[], fields: readonly {
    readonly label: string;
    readonly key: import("ts-essentials").DeepReadonly<T>;
    readonly description?: string | undefined;
    readonly alternateMatches?: readonly string[] | undefined;
    readonly validations?: readonly ({
        readonly rule: "required";
        readonly errorMessage?: string | undefined;
        readonly level?: import("../../../types").ErrorLevel | undefined;
    } | {
        readonly rule: "unique";
        readonly allowEmpty?: boolean | undefined;
        readonly errorMessage?: string | undefined;
        readonly level?: import("../../../types").ErrorLevel | undefined;
    } | {
        readonly rule: "regex";
        readonly value: string;
        readonly flags?: string | undefined;
        readonly errorMessage: string;
        readonly level?: import("../../../types").ErrorLevel | undefined;
    })[] | undefined;
    readonly fieldType: {
        readonly type: "checkbox";
        readonly booleanMatches?: {
            readonly [x: string]: boolean;
        } | undefined;
    } | {
        readonly type: "select";
        readonly options: readonly {
            readonly label: string;
            readonly value: string;
        }[];
    } | {
        readonly type: "input";
    };
    readonly example?: string | undefined;
}[], profile: Profile) => ({
    type?: string | undefined;
    themes: string | undefined;
    languages: string | undefined;
    targetCountries: string | undefined;
    linkType: "DO_FOLLOW" | "NO_FOLLOW" | "BOTH" | undefined;
    nbMaxLinksClient: number | undefined;
    nbMaxLinksExternal: number | undefined;
    nbWords: number | undefined;
    sponso: "BOTH" | "SPONSO" | "NO_SPONSO" | undefined;
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
} & Data<T>)[];
