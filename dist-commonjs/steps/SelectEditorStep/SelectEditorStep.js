'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');
var useRsi = require('../../hooks/useRsi.js');
var React = require('react');
var ContinueButton = require('../../components/ContinueButton.js');

const SelectEditorStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const styles = react.useStyleConfig("UploadStep");
    const { translations, fields, organizations } = useRsi.useRsi();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedValue, setSelectedValue] = React.useState(null);
    const handleContinue = async () => {
        setIsLoading(true);
        await onContinue(selectedValue);
        setIsLoading(false);
    };
    const onRowClick = (row) => {
        setSelectedValue(row);
    };
    const filteredOrganizations = organizations.filter((org) => org.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (jsxRuntime.jsxs(react.ModalBody, { children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: "Selectionner une entreprise" }), jsxRuntime.jsx(react.Input, { placeholder: "Rechercher par nom", mt: 4, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), jsxRuntime.jsx(react.Table, { children: jsxRuntime.jsx(react.Tbody, { children: filteredOrganizations.map((row, index) => (jsxRuntime.jsxs(react.Tr, { onClick: () => onRowClick(row), style: {
                            cursor: "pointer",
                            background: selectedValue === row ? "lightgrey" : "none",
                        }, children: [jsxRuntime.jsx(react.Td, { children: row.name }), jsxRuntime.jsx(react.Td, { children: row.id })] }, index))) }) }), selectedValue !== null && jsxRuntime.jsx(ContinueButton.ContinueButton, { onContinue: handleContinue, title: translations.selectHeaderStep.nextButtonTitle, backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading })] }));
};

exports.SelectEditorStep = SelectEditorStep;
