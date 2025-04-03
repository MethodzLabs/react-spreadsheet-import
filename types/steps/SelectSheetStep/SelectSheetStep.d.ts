type SelectSheetProps = {
    sheetNames: string[];
    onContinue: (sheetName: string) => Promise<void>;
    onBack?: () => void;
};
export declare const SelectSheetStep: ({ sheetNames, onContinue, onBack }: SelectSheetProps) => import("react/jsx-runtime").JSX.Element;
export {};
