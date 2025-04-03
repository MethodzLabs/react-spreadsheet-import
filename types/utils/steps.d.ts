import { StepType } from "../steps/UploadFlow";
export declare const steps: readonly ["organizationSelect", "selectImportType", "selectEditorProfile", "uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"];
export declare const stepIndexToStepType: (stepIndex: number) => StepType;
export declare const stepTypeToStepIndex: (type?: StepType) => number;
