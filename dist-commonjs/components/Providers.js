'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var React = require('react');

const RsiContext = React.createContext({});
const rootId = "chakra-modal-rsi";
const Providers = ({ children, theme, rsiValues }) => {
    const mergedTheme = react.extendTheme(theme);
    if (!rsiValues.fields) {
        throw new Error("Fields must be provided to react-spreadsheet-import");
    }
    return (jsxRuntime.jsx(RsiContext.Provider, { value: rsiValues, children: jsxRuntime.jsx(react.ChakraProvider, { children: jsxRuntime.jsx(react.ChakraProvider, { cssVarsRoot: `#${rootId}`, theme: mergedTheme, children: children }) }) }));
};

exports.Providers = Providers;
exports.RsiContext = RsiContext;
exports.rootId = rootId;
