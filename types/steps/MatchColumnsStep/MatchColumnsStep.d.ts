import type { RawData } from "../../types";
import { Profile } from "../SelectEditorProfileStep/SelectEditorProfileStep";
export type MatchColumnsProps<T extends string> = {
    data: RawData[];
    headerValues: RawData;
    onContinue: (data: any[], rawData: RawData[], columns: Columns<T>) => void;
    onBack?: () => void;
    profile: Profile;
};
export declare enum ColumnType {
    empty = 0,
    ignored = 1,
    matched = 2,
    matchedCheckbox = 3,
    matchedSelect = 4,
    matchedSelectOptions = 5
}
export type MatchedOptions<T> = {
    entry: string;
    value: T;
};
type EmptyColumn = {
    type: ColumnType.empty;
    index: number;
    header: string;
};
type IgnoredColumn = {
    type: ColumnType.ignored;
    index: number;
    header: string;
};
type MatchedColumn<T> = {
    type: ColumnType.matched;
    index: number;
    header: string;
    value: T;
};
type MatchedSwitchColumn<T> = {
    type: ColumnType.matchedCheckbox;
    index: number;
    header: string;
    value: T;
};
export type MatchedSelectColumn<T> = {
    type: ColumnType.matchedSelect;
    index: number;
    header: string;
    value: T;
    matchedOptions: Partial<MatchedOptions<T>>[];
};
export type MatchedSelectOptionsColumn<T> = {
    type: ColumnType.matchedSelectOptions;
    index: number;
    header: string;
    value: T;
    matchedOptions: MatchedOptions<T>[];
};
export type Column<T extends string> = EmptyColumn | IgnoredColumn | MatchedColumn<T> | MatchedSwitchColumn<T> | MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
export type Columns<T extends string> = Column<T>[];
export declare const MatchColumnsStep: <T extends string>({ data, headerValues, onContinue, onBack, profile, }: MatchColumnsProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
