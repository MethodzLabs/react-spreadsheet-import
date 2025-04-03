'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var React = require('react');
var useRsi = require('../../hooks/useRsi.js');

const ConfirmCloseAlert = ({ isOpen, onClose, onConfirm }) => {
    const { translations } = useRsi.useRsi();
    const cancelRef = React.useRef(null);
    return (jsxRuntime.jsx(react.AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, isCentered: true, id: "rsi", children: jsxRuntime.jsx(react.AlertDialogOverlay, { children: jsxRuntime.jsxs(react.AlertDialogContent, { children: [jsxRuntime.jsx(react.AlertDialogHeader, { children: translations.alerts.confirmClose.headerTitle }), jsxRuntime.jsx(react.AlertDialogBody, { children: translations.alerts.confirmClose.bodyText }), jsxRuntime.jsxs(react.AlertDialogFooter, { children: [jsxRuntime.jsx(react.Button, { ref: cancelRef, onClick: onClose, variant: "secondary", children: translations.alerts.confirmClose.cancelButtonTitle }), jsxRuntime.jsx(react.Button, { colorScheme: "red", onClick: onConfirm, ml: 3, children: translations.alerts.confirmClose.exitButtonTitle })] })] }) }) }));
};

exports.ConfirmCloseAlert = ConfirmCloseAlert;
