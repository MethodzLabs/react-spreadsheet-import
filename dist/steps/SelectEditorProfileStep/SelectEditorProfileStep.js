import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { useDisclosure, useStyleConfig, ModalBody, Heading, Text, VStack, Box, Button, Flex, HStack, SimpleGrid, Badge, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, FormControl, FormLabel, Input, Select, InputGroup, NumberInput, NumberInputField, InputRightAddon, ModalFooter } from '@chakra-ui/react';
import { useRsi } from '../../hooks/useRsi.js';
import { ContinueButton } from '../../components/ContinueButton.js';

// Sample default profile for new profile creation
const DEFAULT_PROFILE = {
    type: undefined,
    themes: undefined,
    languages: undefined,
    targetCountries: undefined,
    linkType: undefined,
    nbMaxLinksClient: undefined,
    nbMaxLinksExternal: undefined,
    nbWords: undefined,
    sponso: undefined,
    isPrivate: undefined,
    isGoogleNews: undefined,
    validityDuration: undefined,
    category: undefined,
    categoryUrl: undefined,
    redactionType: undefined,
    priceWithoutRedaction: undefined,
    priceWithRedaction: undefined,
    additionnalPriceRedaction: undefined,
    additionnalPriceCrypto: undefined,
    additionnalPriceHealth: undefined,
    additionnalPriceCBD: undefined,
    additionnalPriceSex: undefined,
    additionnalPriceFinance: undefined,
    additionnalPriceCasino: undefined,
    additionalPriceSponso: undefined,
    additionalPriceDofollow: undefined,
    pricePer100Words: undefined,
};
// Helper function to format enum values for display
const formatEnumValue = (value) => {
    if (value) {
        return value
            .split("_")
            ?.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");
    }
    else {
        return undefined;
    }
};
const SelectEditorProfileStep = ({ onContinue, organization, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newProfile, setNewProfile] = useState({ ...DEFAULT_PROFILE });
    useState("");
    const [isEditing, setIsEditing] = useState(false);
    useState("themes");
    const styles = useStyleConfig("UploadStep");
    const { getProfiles, translations, saveProfiles, fields } = useRsi();
    useEffect(() => {
        getProfiles(organization.id).then((response) => {
            setProfiles(response.data.data);
        });
    }, []);
    const handleContinue = useCallback(async () => {
        console.log(selectedProfile);
        if (!selectedProfile)
            return;
        setIsLoading(true);
        await onContinue(selectedProfile);
        setIsLoading(false);
    }, [onContinue, selectedProfile]);
    const handleProfileSelect = (profile) => {
        setSelectedProfile(profile);
    };
    const handleInputChange = (field, value) => {
        setNewProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSaveProfile = async () => {
        // Add an ID and name if not provided for new profiles
        const profileToSave = {
            ...newProfile,
            organizationId: organization.id,
            id: newProfile?.id,
            name: newProfile.name || `Profile ${profiles.length + 1}`,
        };
        try {
            const response = await saveProfiles(organization.id, profileToSave);
            if (isEditing) {
                // Update the profiles list with the edited profile
                setProfiles((prev) => prev.map((p) => (p.id === response.data.data.id ? response.data.data : p)));
                // If the edited profile was the selected one, update the selection
            }
            else {
                // Add the new profile to the list
                setProfiles((prev) => [...prev, response.data.data]);
            }
            // Close the modal and reset editing state
            onClose();
            setIsEditing(false);
        }
        catch (error) {
            alert("Erreur lors de la sauvegarde du profil");
            console.error(error);
        }
    };
    const handleEditProfile = (profile, e) => {
        // Prevent triggering the profile selection when clicking the edit button
        e.stopPropagation();
        // Set the profile to edit, ensuring array fields exist
        setNewProfile({
            ...profile,
        });
        setIsEditing(true);
        onOpen();
    };
    const handleCreateNewProfile = () => {
        setNewProfile({
            ...DEFAULT_PROFILE,
        });
        setIsEditing(false);
        onOpen();
    };
    // Helpers for tag inputs
    // Get badge color based on link type
    const getLinkTypeBadgeColor = (linkType) => {
        switch (linkType) {
            case "DO_FOLLOW":
                return "green";
            case "NO_FOLLOW":
                return "orange";
            case "BOTH":
                return "blue";
            default:
                return "gray";
        }
    };
    // Get badge color based on sponsorship
    const getSponsoBadgeColor = (sponso) => {
        switch (sponso) {
            case "SPONSO":
                return "purple";
            case "NO_SPONSO":
                return "gray";
            case "BOTH":
                return "teal";
            default:
                return "gray";
        }
    };
    return (jsxs(ModalBody, { children: [jsx(Heading, { sx: styles.heading, children: "Choisir un profil d'import" }), profiles.length === 0 ? (jsx(Text, { mb: 4, children: "Aucun profil disponible" })) : (jsx(VStack, { spacing: 3, align: "stretch", mb: 6, maxHeight: "300px", overflowY: "auto", children: profiles.map((profile, index) => (jsxs(Box, { p: 5, mb: 4, borderWidth: "1px", borderRadius: "lg", cursor: "pointer", bg: selectedProfile === profile ? "blue.50" : "white", borderColor: selectedProfile === profile ? "blue.500" : "gray.200", onClick: () => handleProfileSelect(profile), position: "relative", boxShadow: "sm", children: [jsx(Button, { size: "sm", colorScheme: "blue", variant: "ghost", position: "absolute", top: 3, right: 3, onClick: (e) => handleEditProfile(profile, e), children: "Modifier" }), jsxs(Flex, { direction: "column", gap: 4, pt: 2, children: [jsxs(Flex, { justify: "space-between", align: "baseline", wrap: "wrap", children: [jsx(Heading, { size: "md", mb: 2, children: profile.name ?? `Profil ${index + 1}` }), jsxs(HStack, { spacing: 3, mb: 2, children: [profile.priceWithoutRedaction != null && (jsxs(Text, { fontSize: "sm", color: "gray.600", children: ["Sans r\u00E9daction: ", jsxs("span", { style: { fontWeight: "bold" }, children: [profile.priceWithoutRedaction, "\u20AC"] })] })), profile.priceWithRedaction != null && (jsxs(Text, { fontSize: "md", color: "blue.600", fontWeight: "bold", children: ["Avec r\u00E9daction: ", profile.priceWithRedaction, "\u20AC"] }))] })] }), jsxs(SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxs(Box, { children: [jsxs(Flex, { wrap: "wrap", gap: 2, mb: 4, children: [jsx(Badge, { colorScheme: profile.isGoogleNews ? "green" : "gray", px: 2, py: 1, children: profile.isGoogleNews ? "Google News" : "Hors Google News" }), jsx(Badge, { colorScheme: getLinkTypeBadgeColor(profile.linkType), px: 2, py: 1, children: formatEnumValue(profile.linkType) ?? "Type de lien non spécifié" }), jsx(Badge, { colorScheme: getSponsoBadgeColor(profile.sponso), px: 2, py: 1, children: formatEnumValue(profile.sponso) ?? "Mention sponso non spécifiée" }), jsx(Badge, { colorScheme: profile.isPrivate ? "red" : "green", px: 2, py: 1, children: profile.isPrivate ? "Privé" : "Public" })] }), jsxs(Stack, { spacing: 2, children: [jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Type de r\u00E9daction:" }), jsx(Text, { fontSize: "sm", children: formatEnumValue(profile.redactionType) ?? "Non spécifié" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Nombre de mots:" }), jsx(Text, { fontSize: "sm", children: profile.nbWords ?? "Non spécifié" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Cat\u00E9gorie:" }), jsx(Text, { fontSize: "sm", children: formatEnumValue(profile.category) ?? "Non spécifiée" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Dur\u00E9e de validit\u00E9:" }), jsx(Text, { fontSize: "sm", children: formatEnumValue(profile.validityDuration) ?? "Non spécifiée" })] })] })] }), jsxs(Box, { children: [jsxs(Box, { mb: 4, children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", mb: 1, children: "Liens autoris\u00E9s" }), jsxs(Flex, { gap: 4, children: [jsxs(Text, { fontSize: "sm", children: ["Client: max ", profile.nbMaxLinksClient ?? "?"] }), jsxs(Text, { fontSize: "sm", children: ["Externe: max ", profile.nbMaxLinksExternal ?? "?"] })] })] }), jsxs(Stack, { spacing: 2, children: [jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Pays cible:" }), jsx(Text, { fontSize: "sm", children: profile.targetCountries ?? "Non spécifié" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Langue:" }), jsx(Text, { fontSize: "sm", children: profile.languages ?? "Non spécifié" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Type de site:" }), jsx(Text, { fontSize: "sm", children: profile.type ?? "Non spécifié" })] }), jsxs(Flex, { children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Th\u00E8me:" }), jsx(Text, { fontSize: "sm", children: profile.themes ?? "Non spécifié" })] })] })] })] }), (profile.pricePer100Words != null ||
                                    profile.additionnalPriceCrypto != null ||
                                    profile.additionnalPriceHealth != null ||
                                    profile.additionnalPriceCBD != null ||
                                    profile.additionnalPriceSex != null ||
                                    profile.additionnalPriceFinance != null ||
                                    profile.additionnalPriceCasino != null ||
                                    profile.additionalPriceSponso != null ||
                                    profile.additionalPriceDofollow != null) && (jsxs(Box, { borderTopWidth: "1px", pt: 3, mt: 2, children: [jsx(Text, { fontSize: "sm", fontWeight: "semibold", mb: 2, children: "Frais suppl\u00E9mentaires" }), jsxs(SimpleGrid, { columns: [2, 3, 4], spacing: 3, children: [profile.pricePer100Words != null && (jsxs(Text, { fontSize: "sm", children: ["100 mots: +", profile.pricePer100Words, "\u20AC"] })), profile.additionnalPriceCrypto != null && (jsxs(Text, { fontSize: "sm", children: ["Crypto: +", profile.additionnalPriceCrypto, "\u20AC"] })), profile.additionnalPriceHealth != null && (jsxs(Text, { fontSize: "sm", children: ["Sant\u00E9: +", profile.additionnalPriceHealth, "\u20AC"] })), profile.additionnalPriceCBD != null && (jsxs(Text, { fontSize: "sm", children: ["CBD: +", profile.additionnalPriceCBD, "\u20AC"] })), profile.additionnalPriceSex != null && (jsxs(Text, { fontSize: "sm", children: ["Sexe: +", profile.additionnalPriceSex, "\u20AC"] })), profile.additionnalPriceFinance != null && (jsxs(Text, { fontSize: "sm", children: ["Finance: +", profile.additionnalPriceFinance, "\u20AC"] })), profile.additionnalPriceCasino != null && (jsxs(Text, { fontSize: "sm", children: ["Casino: +", profile.additionnalPriceCasino, "\u20AC"] })), profile.additionalPriceSponso != null && (jsxs(Text, { fontSize: "sm", children: ["Sponsoris\u00E9: +", profile.additionalPriceSponso, "\u20AC"] })), profile.additionalPriceDofollow != null && (jsxs(Text, { fontSize: "sm", children: ["Dofollow: +", profile.additionalPriceDofollow, "\u20AC"] }))] })] }))] })] }, profile.id ?? index))) })), jsxs(Flex, { justify: "space-between", mt: 4, children: [jsx(Button, { onClick: handleCreateNewProfile, colorScheme: "blue", variant: "outline", children: "Cr\u00E9er un nouveau profil" }), jsx(ContinueButton, { onContinue: handleContinue, title: "Continuer avec ce profil", backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading, onBack: onBack, disabled: !selectedProfile })] }), jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "6xl", children: [jsx(ModalOverlay, {}), jsxs(ModalContent, { children: [jsx(ModalHeader, { children: isEditing ? "Modifier le profil" : "Créer un nouveau profil" }), jsx(ModalCloseButton, {}), jsx(ModalBody, { children: jsxs("div", { style: { display: "flex", gap: "24px" }, children: [jsxs(Box, { mb: 6, children: [jsx(Heading, { size: "md", mb: 4, children: "Informations G\u00E9n\u00E9rales" }), jsxs(SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxs(FormControl, { children: [jsx(FormLabel, { children: "Nom du profil" }), jsx(Input, { value: newProfile.name || "", onChange: (e) => handleInputChange("name", e.target.value), placeholder: "Mon profile SEO" })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Dur\u00E9e de validit\u00E9" }), jsxs(Select, { value: newProfile.validityDuration ?? "", onChange: (e) => handleInputChange("validityDuration", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "FOREVER", children: "Pour toujours" }), jsx("option", { value: "SIX_MONTHS", children: "6 mois" }), jsx("option", { value: "TWELVE_MONTHS", children: "12 mois" }), jsx("option", { value: "TWENTY_FOUR_MONTHS", children: "24 mois" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Type" }), jsxs(Select, { value: newProfile.type ?? "", onChange: (e) => handleInputChange("type", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "type")?.fieldType?.options?.map((option) => (jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Langues" }), jsxs(Select, { value: newProfile.languages ?? "", onChange: (e) => handleInputChange("languages", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "languages")?.fieldType?.options?.map((option) => (jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Theme" }), jsxs(Select, { value: newProfile.themes ?? "", onChange: (e) => handleInputChange("themes", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "themes")?.fieldType?.options?.map((option) => (jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Pays" }), jsxs(Select, { value: newProfile.targetCountries ?? "", onChange: (e) => handleInputChange("targetCountries", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "targetCountries")?.fieldType?.options?.map((option) => (jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Cat\u00E9gorie" }), jsxs(Select, { value: newProfile.category ?? "", onChange: (e) => handleInputChange("category", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "IMPOSED", children: "Impos\u00E9e" }), jsx("option", { value: "IMPOSED_CATEGORY", children: "Cat\u00E9gorie impos\u00E9e" }), jsx("option", { value: "NOT_IMPOSED", children: "Non impos\u00E9e" })] })] }), (newProfile.category === "IMPOSED" || newProfile.category === "IMPOSED_CATEGORY") && (jsxs(FormControl, { children: [jsx(FormLabel, { children: "URL de la cat\u00E9gorie" }), jsx(Input, { value: newProfile.categoryUrl || "", onChange: (e) => handleInputChange("categoryUrl", e.target.value) })] })), jsxs(SimpleGrid, { columns: 2, spacing: 4, gridColumn: [null, null, "span 2"], children: [jsxs(FormControl, { children: [jsx(FormLabel, { children: "Catalogue priv\u00E9 ?" }), jsxs(Select, { value: newProfile.isPrivate === undefined ? "" : String(newProfile.isPrivate), onChange: (e) => {
                                                                                const value = e.target.value;
                                                                                handleInputChange("isPrivate", value === "" ? undefined : value === "true");
                                                                            }, children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "true", children: "Oui" }), jsx("option", { value: "false", children: "Non" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Google News ?" }), jsxs(Select, { value: newProfile.isGoogleNews === undefined ? "" : String(newProfile.isGoogleNews), onChange: (e) => {
                                                                                const value = e.target.value;
                                                                                handleInputChange("isGoogleNews", value === "" ? undefined : value === "true");
                                                                            }, children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "true", children: "Oui" }), jsx("option", { value: "false", children: "Non" })] })] })] })] })] }), jsxs(Box, { mb: 6, children: [jsx(Heading, { size: "md", mb: 4, children: "Prix" }), jsxs(SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxs(FormControl, { children: [jsx(FormLabel, { children: "Prix sans r\u00E9daction" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.priceWithoutRedaction || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("priceWithoutRedaction", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Prix avec r\u00E9daction" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.priceWithRedaction || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("priceWithRedaction", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Prix pour 100 mots suppl\u00E9mentaires" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.pricePer100Words || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("pricePer100Words", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsx(Box, { gridColumn: [null, null, "span 2"], children: jsx(Heading, { size: "sm", my: 3, children: "Prix additionnels par niche" }) }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Crypto" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceCrypto || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCrypto", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Sant\u00E9" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceHealth || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceHealth", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "CBD" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceCBD || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCBD", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Casino" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceCasino || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCasino", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Finance" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceFinance || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceFinance", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Sexe" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionnalPriceSex || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceSex", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Prix additionnel pour sponsored" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionalPriceSponso || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionalPriceSponso", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Prix additionnel pour dofollow" }), jsxs(InputGroup, { children: [jsx(NumberInput, { min: 0, value: newProfile.additionalPriceDofollow || "", width: "100%", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("additionalPriceDofollow", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsx(InputRightAddon, { children: "\u20AC" })] })] })] })] }), jsxs(Box, { children: [jsx(Heading, { size: "md", mb: 4, children: "Contenu" }), jsxs(SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxs(FormControl, { children: [jsx(FormLabel, { children: "Nombre de mots" }), jsx(NumberInput, { min: 1, value: newProfile.nbWords ?? "", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("nbWords", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Type de r\u00E9daction" }), jsxs(Select, { value: newProfile.redactionType ?? "", onChange: (e) => handleInputChange("redactionType", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "HUMAN", children: "Humain" }), jsx("option", { value: "AI", children: "IA" }), jsx("option", { value: "MIXED", children: "Mixte" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Nombre max. de liens client" }), jsx(NumberInput, { min: 0, value: newProfile.nbMaxLinksClient ?? "", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("nbMaxLinksClient", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Nombre max. de liens externes" }), jsx(NumberInput, { min: 0, value: newProfile.nbMaxLinksExternal ?? "", children: jsx(NumberInputField, { onChange: (e) => handleInputChange("nbMaxLinksExternal", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Type de lien" }), jsxs(Select, { value: newProfile.linkType ?? "", onChange: (e) => handleInputChange("linkType", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "DO_FOLLOW", children: "Do Follow" }), jsx("option", { value: "NO_FOLLOW", children: "No Follow" }), jsx("option", { value: "BOTH", children: "Les deux" })] })] }), jsxs(FormControl, { children: [jsx(FormLabel, { children: "Mention sponsoris\u00E9" }), jsxs(Select, { value: newProfile.sponso ?? "", onChange: (e) => handleInputChange("sponso", e.target.value), children: [jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsx("option", { value: "SPONSO", children: "Sponsoris\u00E9" }), jsx("option", { value: "NO_SPONSO", children: "Non sponsoris\u00E9" }), jsx("option", { value: "BOTH", children: "Les deux" })] })] })] })] })] }) }), jsxs(ModalFooter, { children: [jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Annuler" }), jsx(Button, { colorScheme: "blue", onClick: handleSaveProfile, children: isEditing ? "Enregistrer les modifications" : "Créer le profil" })] })] })] })] }));
};

export { SelectEditorProfileStep };
