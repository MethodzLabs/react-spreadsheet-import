import { StepType } from "../steps/UploadFlow"

export const steps = ["organizationSelect","selectImportType","selectEditorProfile","uploadStep", "selectHeaderStep", "matchColumnsStep", "validationStep"] as const
const StepTypeToStepRecord: Record<StepType, (typeof steps)[number]> = {
  [StepType.organizationSelect]: "organizationSelect",
  [StepType.selectImportType]: "selectImportType",
  [StepType.selectEditorProfile]: "selectEditorProfile",
  [StepType.upload]: "uploadStep",
  [StepType.selectSheet]: "uploadStep",
  [StepType.selectHeader]: "selectHeaderStep",
  [StepType.matchColumns]: "matchColumnsStep",
  [StepType.validateData]: "validationStep",
}
const StepToStepTypeRecord: Record<(typeof steps)[number], StepType> = {
  organizationSelect: StepType.organizationSelect,
  selectImportType: StepType.selectImportType,
  selectEditorProfile: StepType.selectEditorProfile,
  uploadStep: StepType.upload,
  selectHeaderStep: StepType.selectHeader,
  matchColumnsStep: StepType.matchColumns,
  validationStep: StepType.validateData,
}

export const stepIndexToStepType = (stepIndex: number) => {
  const step = steps[stepIndex]
  return StepToStepTypeRecord[step] || StepType.organizationSelect
}

export const stepTypeToStepIndex = (type?: StepType) => {
  const step = StepTypeToStepRecord[type || StepType.organizationSelect]
  return Math.max(0, steps.indexOf(step))
}
