import { Profile } from "../../steps/SelectEditorProfileStep/SelectEditorProfileStep";
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fields: string[];
    profile: Profile;
    columns: any[];
}
export declare const UnmatchedFieldsAlert: ({ isOpen, onClose, onConfirm, fields, profile, columns }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
