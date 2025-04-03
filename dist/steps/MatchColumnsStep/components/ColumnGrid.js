import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import React from 'react';
import { useStyleConfig, ModalBody, Heading, Flex, Box, Text, ModalFooter, Button, Tooltip } from '@chakra-ui/react';
import { FadingWrapper } from '../../../components/FadingWrapper.js';
import { ContinueButton } from '../../../components/ContinueButton.js';
import { useRsi } from '../../../hooks/useRsi.js';

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
    const { translations } = useRsi();
    const styles = useStyleConfig("MatchColumnsStep");
    const styles2 = useStyleConfig("Modal");
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
            return (jsxs(Flex, { width: "300px", children: [jsx("p", { style: {
                            fontSize: "12px",
                            width: "190px",
                            display: "flex",
                            alignItems: "center",
                        }, children: keyToLabelMap[key] }), jsx(Tooltip, { label: tooltip, hasArrow: true, children: jsx(Flex, { direction: "column", align: "center", justify: "center", w: "60px", h: "60px", bg: bg, borderRadius: "md", boxShadow: "sm", fontSize: "md", fontWeight: "bold", color: "white", p: 1, children: jsx(Text, { children: tag }) }) }, key)] }, key));
        })
            .filter(Boolean);
        // Filter out null items
        return { items, nullMatchFields };
    };
    // Now use the function in your component
    const { items, nullMatchFields } = renderProfileItems();
    return (jsxs(Fragment, { children: [jsxs(ModalBody, { flexDir: "column", p: 8, overflow: "auto", children: [jsx(Heading, { sx: styles.heading, children: translations.matchColumnsStep.title }), jsxs(Flex, { flex: 1, display: "grid", gridTemplateRows: "auto auto auto 1fr", gridTemplateColumns: `0.75rem repeat(${columns.length}, minmax(18rem, auto)) 0.75rem`, children: [jsx(Box, { gridColumn: `1/${columns.length + 3}`, children: jsx(Text, { sx: styles.title, children: translations.matchColumnsStep.userTableTitle }) }), columns.map((column, index) => (jsx(Box, { gridRow: "2/3", gridColumn: `${index + 2}/${index + 3}`, pt: 3, children: userColumn(column) }, column.header + index))), jsx(FadingWrapper, { gridColumn: `1/${columns.length + 3}`, gridRow: "2/3" }), jsx(Box, { gridColumn: `1/${columns.length + 3}`, mt: 7, children: jsx(Text, { sx: styles.title, children: translations.matchColumnsStep.templateTitle }) }), jsx(FadingWrapper, { gridColumn: `1/${columns.length + 3}`, gridRow: "4/5" }), columns.map((column, index) => (jsx(Box, { gridRow: "4/5", gridColumn: `${index + 2}/${index + 3}`, py: "1.125rem", pl: 2, pr: 3, children: templateColumn(column) }, column.header + index)))] })] }), columns.some((column) => "matchedOptions" in column &&
                Array.isArray(column.matchedOptions) &&
                column.matchedOptions.some((option) => !option.value)) || nullMatchFields.length > 0 ? (jsx(Fragment, { children: jsxs(ModalFooter, { children: [jsx(Button, { size: "md", sx: styles2.backButton, onClick: onBack, isLoading: isLoading, variant: "link", children: "retour" }), jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [jsx(UnmatchedColumnsButton, { columns: columns }), jsx(NullFieldsButton, { fields: items, nullsItems: nullMatchFields })] }), jsx("div", {})] }) })) : (jsx(ContinueButton, { isLoading: isLoading, onContinue: onContinue, onBack: onBack, title: translations.matchColumnsStep.nextButtonTitle, backTitle: translations.matchColumnsStep.backButtonTitle }))] }));
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const UnmatchedColumnsButton = ({ columns }) => {
    const [isOpen, setIsOpen] = React.useState(false);
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
    return (jsxs(Fragment, { children: [jsx(Flex, { justifyContent: "center", mt: 2, mb: 4, children: jsxs(Box, { as: "button", bg: "yellow.400", color: "black", px: 4, py: 2, borderRadius: "md", fontWeight: "medium", _hover: { bg: "yellow.500" }, onClick: () => setIsOpen(true), children: ["Il reste ", totalUnmatchedColumns, " colonnes avec des valeurs \u00E0 mapper"] }) }), isOpen && (jsxs(Fragment, { children: [jsx(Box, { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bg: "blackAlpha.600", zIndex: 1000, onClick: () => setIsOpen(false) }), jsxs(Box, { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bg: "white", borderRadius: "md", boxShadow: "lg", p: 5, zIndex: 1001, width: "auto", minWidth: "350px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", children: [jsxs(Flex, { justifyContent: "space-between", alignItems: "center", mb: 4, children: [jsx(Heading, { size: "sm", children: "D\u00E9tails des colonnes \u00E0 mapper" }), jsx(Box, { as: "button", p: 2, borderRadius: "md", _hover: { bg: "gray.100" }, onClick: () => setIsOpen(false), children: "\u2715" })] }), jsxs(Box, { as: "table", width: "100%", children: [jsx(Box, { as: "thead", children: jsxs(Box, { as: "tr", children: [jsx(Box, { as: "th", textAlign: "left", p: 2, children: "Colonne" }), jsx(Box, { as: "th", textAlign: "right", p: 2, children: "Valeurs non mapp\u00E9es" })] }) }), jsx(Box, { as: "tbody", children: unmatchedColumnsData.map((column, index) => (jsxs(Box, { as: "tr", borderTopWidth: "1px", borderColor: "gray.200", children: [jsxs(Box, { as: "td", p: 2, children: [column.name, " -", ">", " ", keyToLabelMap[column.value]] }), jsx(Box, { as: "td", textAlign: "right", p: 2, children: column.unmatchedCount })] }, index))) })] })] })] }))] }));
};
// Replace your existing Object.entries code with the items render
// Add this new component for the null fields button and modal
const NullFieldsButton = ({ fields, nullsItems }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return nullsItems.length > 0 ? (jsxs(Fragment, { children: [jsx(Flex, { justifyContent: "center", mt: 3, mb: 3, children: jsxs(Box, { as: "button", bg: "yellow.400", color: "white", px: 4, py: 2, borderRadius: "md", fontWeight: "medium", _hover: { bg: "red.500" }, onClick: () => setIsOpen(true), children: ["Il reste ", nullsItems.length, " champs \u00E0 valeur null"] }) }), isOpen && (jsxs(Fragment, { children: [jsx(Box, { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bg: "blackAlpha.600", zIndex: 1000, onClick: () => setIsOpen(false) }), jsxs(Box, { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bg: "white", borderRadius: "md", boxShadow: "lg", p: 5, zIndex: 1001, width: "auto", minWidth: "350px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", children: [jsxs(Flex, { justifyContent: "space-between", alignItems: "center", mb: 4, children: [jsx(Heading, { size: "sm", children: "Champs avec valeurs null" }), jsx(Box, { as: "button", p: 2, borderRadius: "md", _hover: { bg: "gray.100" }, onClick: () => setIsOpen(false), children: "\u2715" })] }), jsx(Box, { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: "100%", children: fields.map((field, index) => (jsx(Box, { p: 2, children: field }, index))) })] })] }))] })) : (jsx(Fragment, {}));
};

export { ColumnGrid };
