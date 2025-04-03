'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var chakraReactSelect = require('chakra-react-select');
var MenuPortal = require('./MenuPortal.js');
var react = require('@chakra-ui/react');

const MatchColumnSelect = ({ onChange, value, options, placeholder, name }) => {
    const styles = react.useStyleConfig("MatchColumnsStep");
    return (jsxRuntime.jsx(chakraReactSelect.Select, { value: value || null, colorScheme: "gray", useBasicStyles: true, onChange: onChange, placeholder: placeholder, options: options, menuPosition: "fixed", components: MenuPortal.customComponents, chakraStyles: {
            ...styles.select,
            menu: (provided) => ({
                ...provided,
                width: "auto",
                minWidth: "300px",
                maxWidth: "600px", // Optional: prevent overly wide menus
            }),
            menuList: (provided) => ({
                ...provided,
                maxHeight: "300px",
                overflowY: "auto",
            }),
        }, "aria-label": name }));
};

exports.MatchColumnSelect = MatchColumnSelect;
