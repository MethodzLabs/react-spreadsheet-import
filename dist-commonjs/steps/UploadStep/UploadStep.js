'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var DropZone = require('./components/DropZone.js');
var useRsi = require('../../hooks/useRsi.js');
var ExampleTable = require('./components/ExampleTable.js');
var React = require('react');
var FadingOverlay = require('./components/FadingOverlay.js');

const UploadStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const styles = react.useStyleConfig("UploadStep");
    const { translations, fields } = useRsi.useRsi();
    const handleOnContinue = React.useCallback(async (data, file) => {
        setIsLoading(true);
        await onContinue(data, file);
        setIsLoading(false);
    }, [onContinue]);
    return (jsxRuntime.jsxs(react.ModalBody, { children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: translations.uploadStep.title }), jsxRuntime.jsx(react.Text, { sx: styles.title, children: translations.uploadStep.manifestTitle }), jsxRuntime.jsx(react.Text, { sx: styles.subtitle, children: translations.uploadStep.manifestDescription }), jsxRuntime.jsxs(react.Box, { sx: styles.tableWrapper, children: [jsxRuntime.jsx(ExampleTable.ExampleTable, { fields: fields }), jsxRuntime.jsx(FadingOverlay.FadingOverlay, {})] }), jsxRuntime.jsx(DropZone.DropZone, { onContinue: handleOnContinue, isLoading: isLoading })] }));
};

exports.UploadStep = UploadStep;
