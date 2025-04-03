import { StepType } from '../steps/UploadFlow.js';

const steps = ["organizationSelect", "selectImportType", "selectEditorProfile", "uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"];
const StepTypeToStepRecord = {
    [StepType.organizationSelect]: "organizationSelect",
    [StepType.selectImportType]: "selectImportType",
    [StepType.selectEditorProfile]: "selectEditorProfile",
    [StepType.upload]: "uploadStep",
    [StepType.selectSheet]: "uploadStep",
    [StepType.selectHeader]: "selectHeaderStep",
    [StepType.matchColumns]: "matchColumnsStep",
    [StepType.validateData]: "validationStep",
};
const StepToStepTypeRecord = {
    organizationSelect: StepType.organizationSelect,
    selectImportType: StepType.selectImportType,
    selectEditorProfile: StepType.selectEditorProfile,
    uploadStep: StepType.upload,
    selectHeaderStep: StepType.selectHeader,
    matchColumnsStep: StepType.matchColumns,
    validationStep: StepType.validateData,
};
const stepIndexToStepType = (stepIndex) => {
    const step = steps[stepIndex];
    return StepToStepTypeRecord[step] || StepType.organizationSelect;
};
const stepTypeToStepIndex = (type) => {
    const step = StepTypeToStepRecord[type || StepType.organizationSelect];
    return Math.max(0, steps.indexOf(step));
};

export { stepIndexToStepType, stepTypeToStepIndex, steps };
