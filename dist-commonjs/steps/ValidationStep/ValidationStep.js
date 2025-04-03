'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var ContinueButton = require('../../components/ContinueButton.js');
var useRsi = require('../../hooks/useRsi.js');
var dataMutations = require('./utils/dataMutations.js');
var columns = require('./components/columns.js');
var Table = require('../../components/Table.js');
var SubmitDataAlert = require('../../components/Alerts/SubmitDataAlert.js');

const ValidationStep = ({ initialData, file, onBack, profile }) => {
    const { translations, fields, onClose, onSubmit, rowHook, tableHook } = useRsi.useRsi();
    const styles = react.useStyleConfig("ValidationStep");
    const toast = react.useToast();
    const [data, setData] = React.useState(initialData);
    const [selectedRows, setSelectedRows] = React.useState(new Set());
    const [filterByErrors, setFilterByErrors] = React.useState(false);
    const [showSubmitAlert, setShowSubmitAlert] = React.useState(false);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const updateData = React.useCallback(async (rows, indexes) => {
        // Check if hooks are async - if they are we want to apply changes optimistically for better UX
        if (rowHook?.constructor.name === "AsyncFunction" || tableHook?.constructor.name === "AsyncFunction") {
            setData(rows);
        }
        dataMutations.addErrorsAndRunHooks(rows, fields, rowHook, tableHook, indexes).then((data) => setData(data));
    }, [rowHook, tableHook, fields]);
    const deleteSelectedRows = () => {
        if (selectedRows.size) {
            const newData = data.filter((value) => !selectedRows.has(value.__index));
            updateData(newData);
            setSelectedRows(new Set());
        }
    };
    const updateRows = React.useCallback((rows, changedData) => {
        const changes = changedData?.indexes.reduce((acc, index) => {
            // when data is filtered val !== actual index in data
            const realIndex = data.findIndex((value) => value.__index === rows[index].__index);
            acc[realIndex] = rows[index];
            return acc;
        }, {});
        const realIndexes = changes && Object.keys(changes).map((index) => Number(index));
        const newData = Object.assign([], data, changes);
        updateData(newData, realIndexes);
    }, [data, updateData]);
    const columns$1 = React.useMemo(() => columns.generateColumns(fields), [fields]);
    const tableData = React.useMemo(() => {
        console.log(data);
        const profileData = data.map((value) => {
            return {
                ...value,
                ...Object.fromEntries(Object.entries(value).map(([k, v]) => [k, v ?? profile[k]]))
            };
        });
        console.log(profileData);
        if (filterByErrors) {
            return profileData.filter((value) => {
                if (value?.__errors) {
                    return Object.values(value.__errors)?.filter((err) => err.level === "error").length;
                }
                return false;
            });
        }
        return profileData;
    }, [data, filterByErrors]);
    const rowKeyGetter = React.useCallback((row) => row.__index, []);
    const submitData = async () => {
        const calculatedData = data.reduce((acc, value) => {
            const { __index, __errors, ...values } = value;
            if (__errors) {
                for (const key in __errors) {
                    if (__errors[key].level === "error") {
                        acc.invalidData.push(values);
                        return acc;
                    }
                }
            }
            acc.validData.push(values);
            return acc;
        }, { validData: [], invalidData: [], all: data });
        setShowSubmitAlert(false);
        setSubmitting(true);
        const response = onSubmit(calculatedData, file);
        if (response?.then) {
            response
                .then(() => {
                onClose();
            })
                .catch((err) => {
                toast({
                    status: "error",
                    variant: "left-accent",
                    position: "bottom-left",
                    title: `${translations.alerts.submitError.title}`,
                    description: err?.message || `${translations.alerts.submitError.defaultMessage}`,
                    isClosable: true,
                });
            })
                .finally(() => {
                setSubmitting(false);
            });
        }
        else {
            onClose();
        }
    };
    const onContinue = () => {
        const invalidData = data.find((value) => {
            if (value?.__errors) {
                return !!Object.values(value.__errors)?.filter((err) => err.level === "error").length;
            }
            return false;
        });
        if (!invalidData) {
            submitData();
        }
        else {
            setShowSubmitAlert(true);
        }
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SubmitDataAlert.SubmitDataAlert, { isOpen: showSubmitAlert, onClose: () => setShowSubmitAlert(false), onConfirm: submitData }), jsxRuntime.jsxs(react.ModalBody, { pb: 0, children: [jsxRuntime.jsxs(react.Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2rem", flexWrap: "wrap", gap: "8px", children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: translations.validationStep.title }), jsxRuntime.jsxs(react.Box, { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", children: [jsxRuntime.jsx(react.Button, { variant: "outline", size: "sm", onClick: deleteSelectedRows, children: translations.validationStep.discardButtonTitle }), jsxRuntime.jsx(react.Switch, { display: "flex", alignItems: "center", isChecked: filterByErrors, onChange: () => setFilterByErrors(!filterByErrors), children: translations.validationStep.filterSwitchTitle })] })] }), jsxRuntime.jsx(Table.Table, { rowKeyGetter: rowKeyGetter, rows: tableData, onRowsChange: updateRows, columns: columns$1, selectedRows: selectedRows, onSelectedRowsChange: setSelectedRows, components: {
                            noRowsFallback: (jsxRuntime.jsx(react.Box, { display: "flex", justifyContent: "center", gridColumn: "1/-1", mt: "32px", children: filterByErrors
                                    ? translations.validationStep.noRowsMessageWhenFiltered
                                    : translations.validationStep.noRowsMessage })),
                        } })] }), jsxRuntime.jsx(ContinueButton.ContinueButton, { isLoading: isSubmitting, onContinue: onContinue, onBack: onBack, title: translations.validationStep.nextButtonTitle, backTitle: translations.validationStep.backButtonTitle })] }));
};

exports.ValidationStep = ValidationStep;
