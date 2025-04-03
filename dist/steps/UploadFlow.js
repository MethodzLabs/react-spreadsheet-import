import { jsx } from 'react/jsx-runtime';
import { useState, useCallback } from 'react';
import { useToast, Progress } from '@chakra-ui/react';
import { UploadStep } from './UploadStep/UploadStep.js';
import { SelectHeaderStep } from './SelectHeaderStep/SelectHeaderStep.js';
import { SelectSheetStep } from './SelectSheetStep/SelectSheetStep.js';
import { mapWorkbook } from '../utils/mapWorkbook.js';
import { ValidationStep } from './ValidationStep/ValidationStep.js';
import { addErrorsAndRunHooks } from './ValidationStep/utils/dataMutations.js';
import { MatchColumnsStep } from './MatchColumnsStep/MatchColumnsStep.js';
import { exceedsMaxRecords } from '../utils/exceedsMaxRecords.js';
import { useRsi } from '../hooks/useRsi.js';
import { SelectEditorStep } from './SelectEditorStep/SelectEditorStep.js';
import { SelectImportTypeStep } from './SelectImportTypeStep/SelectImportTypeStep.js';
import { SelectEditorProfileStep } from './SelectEditorProfileStep/SelectEditorProfileStep.js';

var StepType;
(function (StepType) {
    StepType["organizationSelect"] = "organizationSelect";
    StepType["selectImportType"] = "selectImportType";
    StepType["selectEditorProfile"] = "selectEditorProfile";
    StepType["upload"] = "upload";
    StepType["selectSheet"] = "selectSheet";
    StepType["selectHeader"] = "selectHeader";
    StepType["matchColumns"] = "matchColumns";
    StepType["validateData"] = "validateData";
})(StepType || (StepType = {}));
const UploadFlow = ({ state, onNext, onBack }) => {
    const { maxRecords, translations, uploadStepHook, selectHeaderStepHook, matchColumnsStepHook, fields, rowHook, tableHook, } = useRsi();
    const [uploadedFile, setUploadedFile] = useState(null);
    const toast = useToast();
    const [organization, setOrganization] = useState(null);
    const [profile, setProfile] = useState(null);
    const errorToast = useCallback((description) => {
        toast({
            status: "error",
            variant: "left-accent",
            position: "bottom-left",
            title: `${translations.alerts.toast.error}`,
            description,
            isClosable: true,
        });
    }, [toast, translations]);
    switch (state.type) {
        case StepType.organizationSelect:
            return (jsx(SelectEditorStep, { onContinue: async (...args) => {
                    try {
                        setOrganization(args[0]);
                        onNext({
                            type: StepType.selectImportType,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case StepType.selectImportType:
            return (jsx(SelectImportTypeStep, { onContinue: async (...args) => {
                    try {
                        onNext({
                            type: StepType.selectEditorProfile,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case StepType.selectEditorProfile:
            return (jsx(SelectEditorProfileStep, { onBack: onBack, organization: organization, onContinue: async (...args) => {
                    try {
                        setProfile(args[0]);
                        onNext({
                            type: StepType.upload,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case StepType.upload:
            return (jsx(UploadStep, { onBack: onBack, onContinue: async (workbook, file) => {
                    setUploadedFile(file);
                    const isSingleSheet = workbook.SheetNames.length === 1;
                    if (isSingleSheet) {
                        if (maxRecords && exceedsMaxRecords(workbook.Sheets[workbook.SheetNames[0]], maxRecords)) {
                            errorToast(translations.uploadStep.maxRecordsExceeded(maxRecords.toString()));
                            return;
                        }
                        try {
                            const mappedWorkbook = await uploadStepHook(mapWorkbook(workbook));
                            onNext({
                                type: StepType.selectHeader,
                                data: mappedWorkbook,
                            });
                        }
                        catch (e) {
                            errorToast(e.message);
                        }
                    }
                    else {
                        onNext({ type: StepType.selectSheet, workbook });
                    }
                } }));
        case StepType.selectSheet:
            return (jsx(SelectSheetStep, { sheetNames: state.workbook.SheetNames, onContinue: async (sheetName) => {
                    if (maxRecords && exceedsMaxRecords(state.workbook.Sheets[sheetName], maxRecords)) {
                        errorToast(translations.uploadStep.maxRecordsExceeded(maxRecords.toString()));
                        return;
                    }
                    try {
                        const mappedWorkbook = await uploadStepHook(mapWorkbook(state.workbook, sheetName));
                        onNext({
                            type: StepType.selectHeader,
                            data: mappedWorkbook,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case StepType.selectHeader:
            return (jsx(SelectHeaderStep, { data: state.data, onContinue: async (...args) => {
                    try {
                        const { data, headerValues } = await selectHeaderStepHook(...args);
                        onNext({
                            type: StepType.matchColumns,
                            data,
                            headerValues,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case StepType.matchColumns:
            return (jsx(MatchColumnsStep, { profile: profile, data: state.data, headerValues: state.headerValues, onContinue: async (values, rawData, columns) => {
                    try {
                        const data = await matchColumnsStepHook(values, rawData, columns);
                        const dataWithMeta = await addErrorsAndRunHooks(data, fields, rowHook, tableHook);
                        onNext({
                            type: StepType.validateData,
                            data: dataWithMeta,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case StepType.validateData:
            return (jsx(ValidationStep, { profile: profile, initialData: state.data, file: uploadedFile, onBack: onBack }));
        default:
            return jsx(Progress, { isIndeterminate: true });
    }
};

export { StepType, UploadFlow };
