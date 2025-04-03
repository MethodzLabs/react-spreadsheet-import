import type { RawData } from "../../types";
type SelectHeaderProps = {
    data: RawData[];
    onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>;
    onBack?: () => void;
};
export declare const SelectHeaderStep: ({ data, onContinue, onBack }: SelectHeaderProps) => import("react/jsx-runtime").JSX.Element;
export {};
