import { jsxs, jsx } from 'react/jsx-runtime';
import { useStyleConfig, ModalBody, Heading } from '@chakra-ui/react';
import { useRsi } from '../../hooks/useRsi.js';
import { useState, useCallback } from 'react';
import { ContinueButton } from '../../components/ContinueButton.js';

const SelectImportTypeStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const styles = useStyleConfig("UploadStep");
    const { translations, fields } = useRsi();
    const [selectedImportType, setSelectedImportType] = useState(null);
    const handleContinue = useCallback(async () => {
        const data = [];
        setIsLoading(true);
        await onContinue(data);
        setIsLoading(false);
    }, [onContinue]);
    const importOptions = [
        "Inscription simple",
        "Mise à jour des sites éditeurs",
        "Mise à jour des prix",
        "Remplacement des offres",
    ];
    const importOptionsDesc = [
        "Enregistre les sites présent dans le fichier, ignore ceux déja présent en base, si les offres ont une visibilité différente ( catalogue privé / catalogue publique ) ou un éditeur différent que celles déja présente en base, ajoute aux offres existantes",
        "Enregistre les sites présent dans le fichier, met uniquement à jour les prix pour ceux déjà présent en base, supprime les sites qui ne sont plus présent.",
        "Agis uniquement sur les tarifs des sites, sans enregistrer ni supprimer de sites",
        "Remplace toutes les offres du même type ",
    ];
    const handleOptionClick = useCallback((option) => {
        setSelectedImportType(option);
    }, []);
    return (jsxs(ModalBody, { children: [jsx(Heading, { sx: styles.heading, children: "Type d'import" }), jsx("div", { id: "selector", style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                    marginTop: "1rem",
                }, children: importOptions.map((option, index) => (jsxs("div", { onClick: () => handleOptionClick(option), style: {
                        border: selectedImportType === option ? "2px solid #007ACC" : "1px solid #ccc",
                        padding: "1rem",
                        textAlign: "center",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }, children: [jsx("div", { children: option }), jsx("div", { style: { fontWeight: "lighter", fontSize: "12px" }, children: importOptionsDesc[index] })] }, option))) }), selectedImportType !== null && jsx(ContinueButton, { onContinue: handleContinue, title: translations.selectHeaderStep.nextButtonTitle, backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading })] }));
};

export { SelectImportTypeStep };
