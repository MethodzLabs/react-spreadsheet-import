'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var React = require('react');
var useRsi = require('../../hooks/useRsi.js');

const UnmatchedFieldsAlert = ({ isOpen, onClose, onConfirm, fields, profile, columns }) => {
    const { allowInvalidSubmit, translations } = useRsi.useRsi();
    const cancelRef = React.useRef(null);
    return (jsxRuntime.jsx(react.AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, isCentered: true, id: "rsi", children: jsxRuntime.jsx(react.AlertDialogOverlay, { children: jsxRuntime.jsxs(react.AlertDialogContent, { children: [jsxRuntime.jsx(react.AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: translations.alerts.unmatchedRequiredFields.headerTitle }), jsxRuntime.jsxs(react.AlertDialogBody, { children: [translations.alerts.unmatchedRequiredFields.bodyText, jsxRuntime.jsxs(react.Box, { pt: 3, children: [jsxRuntime.jsx(react.Text, { display: "inline", children: translations.alerts.unmatchedRequiredFields.listTitle }), jsxRuntime.jsxs(react.Text, { display: "inline", fontWeight: "bold", children: [" ", fields.join(", ")] })] })] }), jsxRuntime.jsxs(react.AlertDialogFooter, { children: [jsxRuntime.jsx(react.Button, { ref: cancelRef, onClick: onClose, variant: "secondary", children: translations.alerts.unmatchedRequiredFields.cancelButtonTitle }), allowInvalidSubmit && (jsxRuntime.jsx(react.Button, { onClick: onConfirm, ml: 3, children: translations.alerts.unmatchedRequiredFields.continueButtonTitle }))] })] }) }) }));
};

exports.UnmatchedFieldsAlert = UnmatchedFieldsAlert;
