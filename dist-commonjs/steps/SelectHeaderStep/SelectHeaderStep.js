'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var SelectHeaderTable = require('./components/SelectHeaderTable.js');
var ContinueButton = require('../../components/ContinueButton.js');
var useRsi = require('../../hooks/useRsi.js');

const SelectHeaderStep = ({ data, onContinue, onBack }) => {
    const styles = react.useStyleConfig("SelectHeaderStep");
    const { translations } = useRsi.useRsi();
    const [selectedRows, setSelectedRows] = React.useState(new Set([0]));
    const [isLoading, setIsLoading] = React.useState(false);
    const handleContinue = React.useCallback(async () => {
        const [selectedRowIndex] = selectedRows;
        // We consider data above header to be redundant
        const trimmedData = data.slice(selectedRowIndex + 1);
        setIsLoading(true);
        await onContinue(data[selectedRowIndex], trimmedData);
        setIsLoading(false);
    }, [onContinue, data, selectedRows]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(react.ModalBody, { pb: 0, children: [jsxRuntime.jsx(react.Heading, { ...styles.heading, children: translations.selectHeaderStep.title }), jsxRuntime.jsx(SelectHeaderTable.SelectHeaderTable, { data: data, selectedRows: selectedRows, setSelectedRows: setSelectedRows })] }), jsxRuntime.jsx(ContinueButton.ContinueButton, { onContinue: handleContinue, onBack: onBack, title: translations.selectHeaderStep.nextButtonTitle, backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading })] }));
};

exports.SelectHeaderStep = SelectHeaderStep;
