import type { Field } from "../../../types";
import { Column, MatchColumnsProps } from "../MatchColumnsStep";
export declare const setColumn: <T extends string>(oldColumn: Column<T>, savedMapping: any, field?: Field<T> | undefined, data?: import("../../../types").RawData[] | undefined, autoMapSelectValues?: boolean) => Column<T>;
