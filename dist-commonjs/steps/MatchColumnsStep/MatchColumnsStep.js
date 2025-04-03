'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var UserTableColumn = require('./components/UserTableColumn.js');
var useRsi = require('../../hooks/useRsi.js');
var TemplateColumn = require('./components/TemplateColumn.js');
var ColumnGrid = require('./components/ColumnGrid.js');
var setColumn = require('./utils/setColumn.js');
var setIgnoreColumn = require('./utils/setIgnoreColumn.js');
var setSubColumn = require('./utils/setSubColumn.js');
var normalizeTableData = require('./utils/normalizeTableData.js');
var getMatchedColumns = require('./utils/getMatchedColumns.js');
var UnmatchedFieldsAlert = require('../../components/Alerts/UnmatchedFieldsAlert.js');
var findUnmatchedRequiredFields = require('./utils/findUnmatchedRequiredFields.js');

exports.ColumnType = void 0;
(function (ColumnType) {
    ColumnType[ColumnType["empty"] = 0] = "empty";
    ColumnType[ColumnType["ignored"] = 1] = "ignored";
    ColumnType[ColumnType["matched"] = 2] = "matched";
    ColumnType[ColumnType["matchedCheckbox"] = 3] = "matchedCheckbox";
    ColumnType[ColumnType["matchedSelect"] = 4] = "matchedSelect";
    ColumnType[ColumnType["matchedSelectOptions"] = 5] = "matchedSelectOptions";
})(exports.ColumnType || (exports.ColumnType = {}));
const MatchColumnsStep = ({ data, headerValues, onContinue, onBack, profile, }) => {
    const toast = react.useToast();
    const dataExample = data.slice(0, 2);
    const { fields, autoMapHeaders, autoMapSelectValues, autoMapDistance, translations, savedMapping, saveMapping, saveSavedAlternateFields, } = useRsi.useRsi();
    const [isLoading, setIsLoading] = React.useState(false);
    const [columns, setColumns] = React.useState(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    [...headerValues].map((value, index) => ({ type: exports.ColumnType.empty, index, header: value ?? "" })));
    const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] = React.useState(false);
    const onChange = React.useCallback((value, columnIndex) => {
        saveSavedAlternateFields(value, headerValues[columnIndex]?.toString());
        const field = fields.find((field) => field.key === value);
        const existingFieldIndex = columns.findIndex((column) => "value" in column && column.value === field.key);
        setColumns(columns.map((column, index) => {
            columnIndex === index ? setColumn.setColumn(column, savedMapping, field, data) : column;
            if (columnIndex === index) {
                return setColumn.setColumn(column, savedMapping, field, data, autoMapSelectValues);
            }
            else if (index === existingFieldIndex) {
                toast({
                    status: "warning",
                    variant: "left-accent",
                    position: "bottom-left",
                    title: translations.matchColumnsStep.duplicateColumnWarningTitle,
                    description: translations.matchColumnsStep.duplicateColumnWarningDescription,
                    isClosable: true,
                });
                return setColumn.setColumn(column, savedMapping);
            }
            else {
                return column;
            }
        }));
    }, [
        autoMapSelectValues,
        columns,
        data,
        fields,
        toast,
        translations.matchColumnsStep.duplicateColumnWarningDescription,
        translations.matchColumnsStep.duplicateColumnWarningTitle,
    ]);
    const onIgnore = React.useCallback((columnIndex) => {
        setColumns(columns.map((column, index) => (columnIndex === index ? setIgnoreColumn.setIgnoreColumn(column) : column)));
    }, [columns, setColumns]);
    const onRevertIgnore = React.useCallback((columnIndex) => {
        setColumns(columns.map((column, index) => (columnIndex === index ? setColumn.setColumn(column, savedMapping) : column)));
    }, [columns, setColumns]);
    const onSubChange = React.useCallback((value, columnIndex, entry) => {
        const column = columns[columnIndex];
        saveMapping(column.value, entry, value);
        setColumns(columns.map((column, index) => columnIndex === index && "matchedOptions" in column ? setSubColumn.setSubColumn(column, entry, value) : column));
    }, [columns, setColumns]);
    const unmatchedRequiredFields = React.useMemo(() => findUnmatchedRequiredFields.findUnmatchedRequiredFields(fields, columns), [fields, columns]);
    const handleOnContinue = React.useCallback(async () => {
        if (unmatchedRequiredFields.length > 0) {
            setShowUnmatchedFieldsAlert(true);
        }
        else {
            setIsLoading(true);
            await onContinue(normalizeTableData.normalizeTableData(columns, data, fields, profile), data, columns);
            setIsLoading(false);
        }
    }, [unmatchedRequiredFields.length, onContinue, columns, data, fields]);
    const handleAlertOnContinue = React.useCallback(async () => {
        setShowUnmatchedFieldsAlert(false);
        setIsLoading(true);
        await onContinue(normalizeTableData.normalizeTableData(columns, data, fields, profile), data, columns);
        setIsLoading(false);
    }, [onContinue, columns, data, fields]);
    React.useEffect(() => {
        if (autoMapHeaders) {
            setColumns(getMatchedColumns.getMatchedColumns(columns, fields, data, autoMapDistance, savedMapping, autoMapSelectValues));
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(UnmatchedFieldsAlert.UnmatchedFieldsAlert, { profile: profile, isOpen: showUnmatchedFieldsAlert, onClose: () => setShowUnmatchedFieldsAlert(false), fields: unmatchedRequiredFields.map((elm) => elm.label), onConfirm: handleAlertOnContinue, columns: columns }), jsxRuntime.jsx(ColumnGrid.ColumnGrid, { columns: columns, onContinue: handleOnContinue, onBack: onBack, isLoading: isLoading, toMatch: unmatchedRequiredFields, profile: profile, userColumn: (column) => (jsxRuntime.jsx(UserTableColumn.UserTableColumn, { column: column, onIgnore: onIgnore, onRevertIgnore: onRevertIgnore, entries: dataExample.map((row) => row[column.index]) })), templateColumn: (column) => jsxRuntime.jsx(TemplateColumn.TemplateColumn, { column: column, onChange: onChange, onSubChange: onSubChange }) })] }));
};

exports.MatchColumnsStep = MatchColumnsStep;
