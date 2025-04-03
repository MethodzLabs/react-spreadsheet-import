import type XLSX from "xlsx-ugnis";
type UploadProps = {
    onContinue: (data: XLSX.WorkBook, file: File) => Promise<void>;
    onBack?: () => void;
};
export declare const UploadStep: ({ onContinue }: UploadProps) => import("react/jsx-runtime").JSX.Element;
export {};
