'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var FadingWrapper = require('../../../components/FadingWrapper.js');
var ContinueButton = require('../../../components/ContinueButton.js');
var useRsi = require('../../../hooks/useRsi.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const keyToLabelMap = {
    url: "Url",
    type: "Type de site",
    targetCountries: "Pays cible",
    languages: "Langues",
    themes: "Thematiques",
    presentation: "Description",
    nbWords: "Nombre mot inclus",
    priceWithRedaction: "Tarif avec rédaction",
    priceWithoutRedaction: "Tarif sans rédaction",
    additionnalPriceCasino: "Tarif niche casino",
    additionnalPriceCBD: "Tarif avec rédaction, niche CBD",
    price100words: "Tarif pour 100 mots supplémentaires",
    linkType: "Type de lien",
    redactionType: "Type de redaction",
    nbMaxLinksExternal: "Nombre max de liens sources externes",
    nbMaxLinksClient: "Nombre max de liens vers client",
    sponso: "Mention sponso",
    isPrivate: "Catalogue privé",
    isGoogleNews: "Présent sur Google News",
    validityDuration: "Durée de validité",
    category: "Catégorie",
    categoryUrl: "URL de la catégorie",
};
const ColumnGrid = ({ columns, userColumn, templateColumn, onContinue, onBack, isLoading, toMatch, profile, }) => {
    const { translations } = useRsi.useRsi();
    const styles = react.useStyleConfig("MatchColumnsStep");
    const styles2 = react.useStyleConfig("Modal");
    const toMatchKeys = new Set(toMatch.map((item) => item.key));
    const renderProfileItems = () => {
        // Keep track of fields that are null and in toMatch
        const nullMatchFields = [];
        console.log(columns);
        const items = Object.entries(profile)
            .map(([key, value]) => {
            if (key == "name" ||
                key == "organizationId" ||
                key == "id" ||
                key.startsWith("price") ||
                key.startsWith("additionnal") ||
                key.startsWith("additional"))
                return;
            const isInToMatch = toMatchKeys.has(key);
            let bg = "gray.200";
            let tag = "";
            let tooltip = "";
            if (!isInToMatch) {
                bg = "green.400";
                tag = "C";
                tooltip = 'Utilise la valeur de la colonne "' + columns.find((elm) => elm?.value == key)?.header + ' "';
            }
            else if (value !== null && isInToMatch) {
                bg = "green.400";
                tag = "P";
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tooltip = "Utilise la valeur du profile " + profile[key];
            }
            else if (value == null && isInToMatch) {
                tag = "M";
                bg = "red.400";
                tooltip = "Mapping manquant";
                // Add this field to our nullMatchFields array
                nullMatchFields.push(key);
            }
            return (jsxRuntime.jsxs(react.Flex, { width: "300px", children: [jsxRuntime.jsx("p", { style: {
                            fontSize: "12px",
                            width: "190px",
                            display: "flex",
                            alignItems: "center",
                        }, children: keyToLabelMap[key] }), jsxRuntime.jsx(react.Tooltip, { label: tooltip, hasArrow: true, children: jsxRuntime.jsx(react.Flex, { direction: "column", align: "center", justify: "center", w: "60px", h: "60px", bg: bg, borderRadius: "md", boxShadow: "sm", fontSize: "md", fontWeight: "bold", color: "white", p: 1, children: jsxRuntime.jsx(react.Text, { children: tag }) }) }, key)] }, key));
        })
            .filter(Boolean);
        // Filter out null items
        return { items, nullMatchFields };
    };
    // Now use the function in your component
    const { items, nullMatchFields } = renderProfileItems();
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(react.ModalBody, { flexDir: "column", p: 8, overflow: "auto", children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: translations.matchColumnsStep.title }), jsxRuntime.jsxs(react.Flex, { flex: 1, display: "grid", gridTemplateRows: "auto auto auto 1fr", gridTemplateColumns: `0.75rem repeat(${columns.length}, minmax(18rem, auto)) 0.75rem`, children: [jsxRuntime.jsx(react.Box, { gridColumn: `1/${columns.length + 3}`, children: jsxRuntime.jsx(react.Text, { sx: styles.title, children: translations.matchColumnsStep.userTableTitle }) }), columns.map((column, index) => (jsxRuntime.jsx(react.Box, { gridRow: "2/3", gridColumn: `${index + 2}/${index + 3}`, pt: 3, children: userColumn(column) }, column.header + index))), jsxRuntime.jsx(FadingWrapper.FadingWrapper, { gridColumn: `1/${columns.length + 3}`, gridRow: "2/3" }), jsxRuntime.jsx(react.Box, { gridColumn: `1/${columns.length + 3}`, mt: 7, children: jsxRuntime.jsx(react.Text, { sx: styles.title, children: translations.matchColumnsStep.templateTitle }) }), jsxRuntime.jsx(FadingWrapper.FadingWrapper, { gridColumn: `1/${columns.length + 3}`, gridRow: "4/5" }), columns.map((column, index) => (jsxRuntime.jsx(react.Box, { gridRow: "4/5", gridColumn: `${index + 2}/${index + 3}`, py: "1.125rem", pl: 2, pr: 3, children: templateColumn(column) }, column.header + index)))] })] }), columns.some((column) => "matchedOptions" in column &&
                Array.isArray(column.matchedOptions) &&
                column.matchedOptions.some((option) => !option.value)) || nullMatchFields.length > 0 ? (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs(react.ModalFooter, { children: [jsxRuntime.jsx(react.Button, { size: "md", sx: styles2.backButton, onClick: onBack, isLoading: isLoading, variant: "link", children: "retour" }), jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [jsxRuntime.jsx(UnmatchedColumnsButton, { columns: columns }), jsxRuntime.jsx(NullFieldsButton, { fields: items, nullsItems: nullMatchFields })] }), jsxRuntime.jsx("div", {})] }) })) : (jsxRuntime.jsx(ContinueButton.ContinueButton, { isLoading: isLoading, onContinue: onContinue, onBack: onBack, title: translations.matchColumnsStep.nextButtonTitle, backTitle: translations.matchColumnsStep.backButtonTitle }))] }));
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const UnmatchedColumnsButton = ({ columns }) => {
    const [isOpen, setIsOpen] = React__default["default"].useState(false);
    const unmatchedColumnsData = columns
        .filter((column) => "matchedOptions" in column &&
        Array.isArray(column.matchedOptions) &&
        column.matchedOptions.some((option) => !option.value))
        .map((column) => "matchedOptions" in column && {
        name: column.header,
        value: column.value,
        unmatchedCount: column.matchedOptions.filter((option) => !option.value).length,
    })
        .filter(Boolean); // Filter out any undefined results
    const totalUnmatchedColumns = unmatchedColumnsData.length;
    if (totalUnmatchedColumns === 0)
        return null;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.Flex, { justifyContent: "center", mt: 2, mb: 4, children: jsxRuntime.jsxs(react.Box, { as: "button", bg: "yellow.400", color: "black", px: 4, py: 2, borderRadius: "md", fontWeight: "medium", _hover: { bg: "yellow.500" }, onClick: () => setIsOpen(true), children: ["Il reste ", totalUnmatchedColumns, " colonnes avec des valeurs \u00E0 mapper"] }) }), isOpen && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.Box, { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bg: "blackAlpha.600", zIndex: 1000, onClick: () => setIsOpen(false) }), jsxRuntime.jsxs(react.Box, { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bg: "white", borderRadius: "md", boxShadow: "lg", p: 5, zIndex: 1001, width: "auto", minWidth: "350px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", children: [jsxRuntime.jsxs(react.Flex, { justifyContent: "space-between", alignItems: "center", mb: 4, children: [jsxRuntime.jsx(react.Heading, { size: "sm", children: "D\u00E9tails des colonnes \u00E0 mapper" }), jsxRuntime.jsx(react.Box, { as: "button", p: 2, borderRadius: "md", _hover: { bg: "gray.100" }, onClick: () => setIsOpen(false), children: "\u2715" })] }), jsxRuntime.jsxs(react.Box, { as: "table", width: "100%", children: [jsxRuntime.jsx(react.Box, { as: "thead", children: jsxRuntime.jsxs(react.Box, { as: "tr", children: [jsxRuntime.jsx(react.Box, { as: "th", textAlign: "left", p: 2, children: "Colonne" }), jsxRuntime.jsx(react.Box, { as: "th", textAlign: "right", p: 2, children: "Valeurs non mapp\u00E9es" })] }) }), jsxRuntime.jsx(react.Box, { as: "tbody", children: unmatchedColumnsData.map((column, index) => (jsxRuntime.jsxs(react.Box, { as: "tr", borderTopWidth: "1px", borderColor: "gray.200", children: [jsxRuntime.jsxs(react.Box, { as: "td", p: 2, children: [column.name, " -", ">", " ", keyToLabelMap[column.value]] }), jsxRuntime.jsx(react.Box, { as: "td", textAlign: "right", p: 2, children: column.unmatchedCount })] }, index))) })] })] })] }))] }));
};
// Replace your existing Object.entries code with the items render
// Add this new component for the null fields button and modal
const NullFieldsButton = ({ fields, nullsItems }) => {
    const [isOpen, setIsOpen] = React__default["default"].useState(false);
    return nullsItems.length > 0 ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.Flex, { justifyContent: "center", mt: 3, mb: 3, children: jsxRuntime.jsxs(react.Box, { as: "button", bg: "yellow.400", color: "white", px: 4, py: 2, borderRadius: "md", fontWeight: "medium", _hover: { bg: "red.500" }, onClick: () => setIsOpen(true), children: ["Il reste ", nullsItems.length, " champs \u00E0 valeur null"] }) }), isOpen && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(react.Box, { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bg: "blackAlpha.600", zIndex: 1000, onClick: () => setIsOpen(false) }), jsxRuntime.jsxs(react.Box, { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bg: "white", borderRadius: "md", boxShadow: "lg", p: 5, zIndex: 1001, width: "auto", minWidth: "350px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", children: [jsxRuntime.jsxs(react.Flex, { justifyContent: "space-between", alignItems: "center", mb: 4, children: [jsxRuntime.jsx(react.Heading, { size: "sm", children: "Champs avec valeurs null" }), jsxRuntime.jsx(react.Box, { as: "button", p: 2, borderRadius: "md", _hover: { bg: "gray.100" }, onClick: () => setIsOpen(false), children: "\u2715" })] }), jsxRuntime.jsx(react.Box, { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: "100%", children: fields.map((field, index) => (jsxRuntime.jsx(react.Box, { p: 2, children: field }, index))) })] })] }))] })) : (jsxRuntime.jsx(jsxRuntime.Fragment, {}));
};

exports.ColumnGrid = ColumnGrid;
