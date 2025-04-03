'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var React = require('react');
var ContinueButton = require('../../components/ContinueButton.js');
var useRsi = require('../../hooks/useRsi.js');

const SelectSheetStep = ({ sheetNames, onContinue, onBack }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { translations } = useRsi.useRsi();
    const [value, setValue] = React.useState(sheetNames[0]);
    const styles = react.useStyleConfig("SelectSheetStep");
    const handleOnContinue = React.useCallback(async (data) => {
        setIsLoading(true);
        await onContinue(data);
        setIsLoading(false);
    }, [onContinue]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(react.ModalBody, { alignItems: "center", justifyContent: "center", p: 8, flex: 1, children: [jsxRuntime.jsx(react.Heading, { ...styles.heading, children: translations.uploadStep.selectSheet.title }), jsxRuntime.jsx(react.RadioGroup, { onChange: (value) => setValue(value), value: value, children: jsxRuntime.jsx(react.Stack, { spacing: 8, children: sheetNames.map((sheetName) => (jsxRuntime.jsx(react.Radio, { value: sheetName, ...styles.radio, children: jsxRuntime.jsx(react.Text, { ...styles.radioLabel, children: sheetName }) }, sheetName))) }) })] }), jsxRuntime.jsx(ContinueButton.ContinueButton, { isLoading: isLoading, onContinue: () => handleOnContinue(value), onBack: onBack, title: translations.uploadStep.selectSheet.nextButtonTitle, backTitle: translations.uploadStep.selectSheet.backButtonTitle })] }));
};

exports.SelectSheetStep = SelectSheetStep;
