import type { Fields } from "../../../types";
import type { Columns } from "../MatchColumnsStep";
export declare const findUnmatchedRequiredFields: <T extends string>(fields: readonly {
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
}[], columns: Columns<T>) => {
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
}[];
