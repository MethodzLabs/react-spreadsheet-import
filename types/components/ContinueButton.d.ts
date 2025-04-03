type ContinueButtonProps = {
    onContinue: (val: any) => void;
    onBack?: () => void;
    title: string;
    backTitle?: string;
    isLoading?: boolean;
    disabled?: boolean;
};
export declare const ContinueButton: ({ onContinue, onBack, title, backTitle, isLoading, disabled }: ContinueButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
