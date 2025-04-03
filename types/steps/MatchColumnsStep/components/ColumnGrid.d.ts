import React from "react";
import type { Column, Columns } from "../MatchColumnsStep";
import type { themeOverrides } from "../../../theme";
import { Profile } from "../../SelectEditorProfileStep/SelectEditorProfileStep";
type ColumnGridProps<T extends string> = {
    columns: Columns<T>;
    userColumn: (column: Column<T>) => React.ReactNode;
    templateColumn: (column: Column<T>) => React.ReactNode;
    onContinue: (val: Record<string, string>[]) => void;
    onBack?: () => void;
    isLoading: boolean;
    toMatch: any;
    profile: Profile;
};
export type Styles = (typeof themeOverrides)["components"]["MatchColumnsStep"]["baseStyle"];
export declare const ColumnGrid: <T extends string>({ columns, userColumn, templateColumn, onContinue, onBack, isLoading, toMatch, profile, }: ColumnGridProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
