import { jsxs, jsx } from 'react/jsx-runtime';
import { useStyleConfig, ModalBody, Heading, Input, Table, Tbody, Tr, Td } from '@chakra-ui/react';
import { useRsi } from '../../hooks/useRsi.js';
import { useState } from 'react';
import { ContinueButton } from '../../components/ContinueButton.js';

const SelectEditorStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const styles = useStyleConfig("UploadStep");
    const { translations, fields, organizations } = useRsi();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState(null);
    const handleContinue = async () => {
        setIsLoading(true);
        await onContinue(selectedValue);
        setIsLoading(false);
    };
    const onRowClick = (row) => {
        setSelectedValue(row);
    };
    const filteredOrganizations = organizations.filter((org) => org.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (jsxs(ModalBody, { children: [jsx(Heading, { sx: styles.heading, children: "Selectionner une entreprise" }), jsx(Input, { placeholder: "Rechercher par nom", mt: 4, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), jsx(Table, { children: jsx(Tbody, { children: filteredOrganizations.map((row, index) => (jsxs(Tr, { onClick: () => onRowClick(row), style: {
                            cursor: "pointer",
                            background: selectedValue === row ? "lightgrey" : "none",
                        }, children: [jsx(Td, { children: row.name }), jsx(Td, { children: row.id })] }, index))) }) }), selectedValue !== null && jsx(ContinueButton, { onContinue: handleContinue, title: translations.selectHeaderStep.nextButtonTitle, backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading })] }));
};

export { SelectEditorStep };
