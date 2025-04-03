import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useCallback } from 'react';
import { useStyleConfig, ModalBody, Heading } from '@chakra-ui/react';
import { SelectHeaderTable } from './components/SelectHeaderTable.js';
import { ContinueButton } from '../../components/ContinueButton.js';
import { useRsi } from '../../hooks/useRsi.js';

const SelectHeaderStep = ({ data, onContinue, onBack }) => {
    const styles = useStyleConfig("SelectHeaderStep");
    const { translations } = useRsi();
    const [selectedRows, setSelectedRows] = useState(new Set([0]));
    const [isLoading, setIsLoading] = useState(false);
    const handleContinue = useCallback(async () => {
        const [selectedRowIndex] = selectedRows;
        // We consider data above header to be redundant
        const trimmedData = data.slice(selectedRowIndex + 1);
        setIsLoading(true);
        await onContinue(data[selectedRowIndex], trimmedData);
        setIsLoading(false);
    }, [onContinue, data, selectedRows]);
    return (jsxs(Fragment, { children: [jsxs(ModalBody, { pb: 0, children: [jsx(Heading, { ...styles.heading, children: translations.selectHeaderStep.title }), jsx(SelectHeaderTable, { data: data, selectedRows: selectedRows, setSelectedRows: setSelectedRows })] }), jsx(ContinueButton, { onContinue: handleContinue, onBack: onBack, title: translations.selectHeaderStep.nextButtonTitle, backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading })] }));
};

export { SelectHeaderStep };
