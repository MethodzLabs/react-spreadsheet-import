'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var React = require('react');
var useRsi = require('../../hooks/useRsi.js');

const SubmitDataAlert = ({ isOpen, onClose, onConfirm }) => {
    const { allowInvalidSubmit, translations } = useRsi.useRsi();
    const cancelRef = React.useRef(null);
    return (jsxRuntime.jsx(react.AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, isCentered: true, id: "rsi", children: jsxRuntime.jsx(react.AlertDialogOverlay, { children: jsxRuntime.jsxs(react.AlertDialogContent, { children: [jsxRuntime.jsx(react.AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: translations.alerts.submitIncomplete.headerTitle }), jsxRuntime.jsx(react.AlertDialogBody, { children: allowInvalidSubmit
                            ? translations.alerts.submitIncomplete.bodyText
                            : translations.alerts.submitIncomplete.bodyTextSubmitForbidden }), jsxRuntime.jsxs(react.AlertDialogFooter, { children: [jsxRuntime.jsx(react.Button, { ref: cancelRef, onClick: onClose, variant: "secondary", children: translations.alerts.submitIncomplete.cancelButtonTitle }), allowInvalidSubmit && (jsxRuntime.jsx(react.Button, { onClick: onConfirm, ml: 3, children: translations.alerts.submitIncomplete.finishButtonTitle }))] })] }) }) }));
};

exports.SubmitDataAlert = SubmitDataAlert;
