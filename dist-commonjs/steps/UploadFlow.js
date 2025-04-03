'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var UploadStep = require('./UploadStep/UploadStep.js');
var SelectHeaderStep = require('./SelectHeaderStep/SelectHeaderStep.js');
var SelectSheetStep = require('./SelectSheetStep/SelectSheetStep.js');
var mapWorkbook = require('../utils/mapWorkbook.js');
var ValidationStep = require('./ValidationStep/ValidationStep.js');
var dataMutations = require('./ValidationStep/utils/dataMutations.js');
var MatchColumnsStep = require('./MatchColumnsStep/MatchColumnsStep.js');
var exceedsMaxRecords = require('../utils/exceedsMaxRecords.js');
var useRsi = require('../hooks/useRsi.js');
var SelectEditorStep = require('./SelectEditorStep/SelectEditorStep.js');
var SelectImportTypeStep = require('./SelectImportTypeStep/SelectImportTypeStep.js');
var SelectEditorProfileStep = require('./SelectEditorProfileStep/SelectEditorProfileStep.js');

exports.StepType = void 0;
(function (StepType) {
    StepType["organizationSelect"] = "organizationSelect";
    StepType["selectImportType"] = "selectImportType";
    StepType["selectEditorProfile"] = "selectEditorProfile";
    StepType["upload"] = "upload";
    StepType["selectSheet"] = "selectSheet";
    StepType["selectHeader"] = "selectHeader";
    StepType["matchColumns"] = "matchColumns";
    StepType["validateData"] = "validateData";
})(exports.StepType || (exports.StepType = {}));
const UploadFlow = ({ state, onNext, onBack }) => {
    const { maxRecords, translations, uploadStepHook, selectHeaderStepHook, matchColumnsStepHook, fields, rowHook, tableHook, } = useRsi.useRsi();
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const toast = react.useToast();
    const [organization, setOrganization] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const errorToast = React.useCallback((description) => {
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
        case exports.StepType.organizationSelect:
            return (jsxRuntime.jsx(SelectEditorStep.SelectEditorStep, { onContinue: async (...args) => {
                    try {
                        setOrganization(args[0]);
                        onNext({
                            type: exports.StepType.selectImportType,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case exports.StepType.selectImportType:
            return (jsxRuntime.jsx(SelectImportTypeStep.SelectImportTypeStep, { onContinue: async (...args) => {
                    try {
                        onNext({
                            type: exports.StepType.selectEditorProfile,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case exports.StepType.selectEditorProfile:
            return (jsxRuntime.jsx(SelectEditorProfileStep.SelectEditorProfileStep, { onBack: onBack, organization: organization, onContinue: async (...args) => {
                    try {
                        setProfile(args[0]);
                        onNext({
                            type: exports.StepType.upload,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                } }));
        case exports.StepType.upload:
            return (jsxRuntime.jsx(UploadStep.UploadStep, { onBack: onBack, onContinue: async (workbook, file) => {
                    setUploadedFile(file);
                    const isSingleSheet = workbook.SheetNames.length === 1;
                    if (isSingleSheet) {
                        if (maxRecords && exceedsMaxRecords.exceedsMaxRecords(workbook.Sheets[workbook.SheetNames[0]], maxRecords)) {
                            errorToast(translations.uploadStep.maxRecordsExceeded(maxRecords.toString()));
                            return;
                        }
                        try {
                            const mappedWorkbook = await uploadStepHook(mapWorkbook.mapWorkbook(workbook));
                            onNext({
                                type: exports.StepType.selectHeader,
                                data: mappedWorkbook,
                            });
                        }
                        catch (e) {
                            errorToast(e.message);
                        }
                    }
                    else {
                        onNext({ type: exports.StepType.selectSheet, workbook });
                    }
                } }));
        case exports.StepType.selectSheet:
            return (jsxRuntime.jsx(SelectSheetStep.SelectSheetStep, { sheetNames: state.workbook.SheetNames, onContinue: async (sheetName) => {
                    if (maxRecords && exceedsMaxRecords.exceedsMaxRecords(state.workbook.Sheets[sheetName], maxRecords)) {
                        errorToast(translations.uploadStep.maxRecordsExceeded(maxRecords.toString()));
                        return;
                    }
                    try {
                        const mappedWorkbook = await uploadStepHook(mapWorkbook.mapWorkbook(state.workbook, sheetName));
                        onNext({
                            type: exports.StepType.selectHeader,
                            data: mappedWorkbook,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case exports.StepType.selectHeader:
            return (jsxRuntime.jsx(SelectHeaderStep.SelectHeaderStep, { data: state.data, onContinue: async (...args) => {
                    try {
                        const { data, headerValues } = await selectHeaderStepHook(...args);
                        onNext({
                            type: exports.StepType.matchColumns,
                            data,
                            headerValues,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case exports.StepType.matchColumns:
            return (jsxRuntime.jsx(MatchColumnsStep.MatchColumnsStep, { profile: profile, data: state.data, headerValues: state.headerValues, onContinue: async (values, rawData, columns) => {
                    try {
                        const data = await matchColumnsStepHook(values, rawData, columns);
                        const dataWithMeta = await dataMutations.addErrorsAndRunHooks(data, fields, rowHook, tableHook);
                        onNext({
                            type: exports.StepType.validateData,
                            data: dataWithMeta,
                        });
                    }
                    catch (e) {
                        errorToast(e.message);
                    }
                }, onBack: onBack }));
        case exports.StepType.validateData:
            return (jsxRuntime.jsx(ValidationStep.ValidationStep, { profile: profile, initialData: state.data, file: uploadedFile, onBack: onBack }));
        default:
            return jsxRuntime.jsx(react.Progress, { isIndeterminate: true });
    }
};

exports.UploadFlow = UploadFlow;
