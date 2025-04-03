'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@chakra-ui/react');
var useRsi = require('../../hooks/useRsi.js');
var ContinueButton = require('../../components/ContinueButton.js');

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
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedProfile, setSelectedProfile] = React.useState(null);
    const [profiles, setProfiles] = React.useState([]);
    const { isOpen, onOpen, onClose } = react.useDisclosure();
    const [newProfile, setNewProfile] = React.useState({ ...DEFAULT_PROFILE });
    React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    React.useState("themes");
    const styles = react.useStyleConfig("UploadStep");
    const { getProfiles, translations, saveProfiles, fields } = useRsi.useRsi();
    React.useEffect(() => {
        getProfiles(organization.id).then((response) => {
            setProfiles(response.data.data);
        });
    }, []);
    const handleContinue = React.useCallback(async () => {
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
                if (selectedProfile?.id === response.data.data.id) {
                    setSelectedProfile(profileToSave);
                }
            }
            else {
                // Add the new profile to the list
                setProfiles((prev) => [...prev, response.data.data]);
                setSelectedProfile(response.data.data);
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
    return (jsxRuntime.jsxs(react.ModalBody, { children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: "Choisir un profil d'import" }), profiles.length === 0 ? (jsxRuntime.jsx(react.Text, { mb: 4, children: "Aucun profil disponible" })) : (jsxRuntime.jsx(react.VStack, { spacing: 3, align: "stretch", mb: 6, maxHeight: "300px", overflowY: "auto", children: profiles.map((profile, index) => (jsxRuntime.jsxs(react.Box, { p: 5, mb: 4, borderWidth: "1px", borderRadius: "lg", cursor: "pointer", bg: selectedProfile === profile ? "blue.50" : "white", borderColor: selectedProfile === profile ? "blue.500" : "gray.200", onClick: () => handleProfileSelect(profile), position: "relative", boxShadow: "sm", children: [jsxRuntime.jsx(react.Button, { size: "sm", colorScheme: "blue", variant: "ghost", position: "absolute", top: 3, right: 3, onClick: (e) => handleEditProfile(profile, e), children: "Modifier" }), jsxRuntime.jsxs(react.Flex, { direction: "column", gap: 4, pt: 2, children: [jsxRuntime.jsxs(react.Flex, { justify: "space-between", align: "baseline", wrap: "wrap", children: [jsxRuntime.jsx(react.Heading, { size: "md", mb: 2, children: profile.name ?? `Profil ${index + 1}` }), jsxRuntime.jsxs(react.HStack, { spacing: 3, mb: 2, children: [profile.priceWithoutRedaction != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", color: "gray.600", children: ["Sans r\u00E9daction: ", jsxRuntime.jsxs("span", { style: { fontWeight: "bold" }, children: [profile.priceWithoutRedaction, "\u20AC"] })] })), profile.priceWithRedaction != null && (jsxRuntime.jsxs(react.Text, { fontSize: "md", color: "blue.600", fontWeight: "bold", children: ["Avec r\u00E9daction: ", profile.priceWithRedaction, "\u20AC"] }))] })] }), jsxRuntime.jsxs(react.SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxRuntime.jsxs(react.Box, { children: [jsxRuntime.jsxs(react.Flex, { wrap: "wrap", gap: 2, mb: 4, children: [jsxRuntime.jsx(react.Badge, { colorScheme: profile.isGoogleNews ? "green" : "gray", px: 2, py: 1, children: profile.isGoogleNews ? "Google News" : "Hors Google News" }), jsxRuntime.jsx(react.Badge, { colorScheme: getLinkTypeBadgeColor(profile.linkType), px: 2, py: 1, children: formatEnumValue(profile.linkType) ?? "Type de lien non spécifié" }), jsxRuntime.jsx(react.Badge, { colorScheme: getSponsoBadgeColor(profile.sponso), px: 2, py: 1, children: formatEnumValue(profile.sponso) ?? "Mention sponso non spécifiée" }), jsxRuntime.jsx(react.Badge, { colorScheme: profile.isPrivate ? "red" : "green", px: 2, py: 1, children: profile.isPrivate ? "Privé" : "Public" })] }), jsxRuntime.jsxs(react.Stack, { spacing: 2, children: [jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Type de r\u00E9daction:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: formatEnumValue(profile.redactionType) ?? "Non spécifié" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Nombre de mots:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: profile.nbWords ?? "Non spécifié" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Cat\u00E9gorie:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: formatEnumValue(profile.category) ?? "Non spécifiée" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Dur\u00E9e de validit\u00E9:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: formatEnumValue(profile.validityDuration) ?? "Non spécifiée" })] })] })] }), jsxRuntime.jsxs(react.Box, { children: [jsxRuntime.jsxs(react.Box, { mb: 4, children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", mb: 1, children: "Liens autoris\u00E9s" }), jsxRuntime.jsxs(react.Flex, { gap: 4, children: [jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Client: max ", profile.nbMaxLinksClient ?? "?"] }), jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Externe: max ", profile.nbMaxLinksExternal ?? "?"] })] })] }), jsxRuntime.jsxs(react.Stack, { spacing: 2, children: [jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Pays cible:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: profile.targetCountries ?? "Non spécifié" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Langue:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: profile.languages ?? "Non spécifié" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Type de site:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: profile.type ?? "Non spécifié" })] }), jsxRuntime.jsxs(react.Flex, { children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", w: "40%", children: "Th\u00E8me:" }), jsxRuntime.jsx(react.Text, { fontSize: "sm", children: profile.themes ?? "Non spécifié" })] })] })] })] }), (profile.pricePer100Words != null ||
                                    profile.additionnalPriceCrypto != null ||
                                    profile.additionnalPriceHealth != null ||
                                    profile.additionnalPriceCBD != null ||
                                    profile.additionnalPriceSex != null ||
                                    profile.additionnalPriceFinance != null ||
                                    profile.additionnalPriceCasino != null ||
                                    profile.additionalPriceSponso != null ||
                                    profile.additionalPriceDofollow != null) && (jsxRuntime.jsxs(react.Box, { borderTopWidth: "1px", pt: 3, mt: 2, children: [jsxRuntime.jsx(react.Text, { fontSize: "sm", fontWeight: "semibold", mb: 2, children: "Frais suppl\u00E9mentaires" }), jsxRuntime.jsxs(react.SimpleGrid, { columns: [2, 3, 4], spacing: 3, children: [profile.pricePer100Words != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["100 mots: +", profile.pricePer100Words, "\u20AC"] })), profile.additionnalPriceCrypto != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Crypto: +", profile.additionnalPriceCrypto, "\u20AC"] })), profile.additionnalPriceHealth != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Sant\u00E9: +", profile.additionnalPriceHealth, "\u20AC"] })), profile.additionnalPriceCBD != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["CBD: +", profile.additionnalPriceCBD, "\u20AC"] })), profile.additionnalPriceSex != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Sexe: +", profile.additionnalPriceSex, "\u20AC"] })), profile.additionnalPriceFinance != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Finance: +", profile.additionnalPriceFinance, "\u20AC"] })), profile.additionnalPriceCasino != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Casino: +", profile.additionnalPriceCasino, "\u20AC"] })), profile.additionalPriceSponso != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Sponsoris\u00E9: +", profile.additionalPriceSponso, "\u20AC"] })), profile.additionalPriceDofollow != null && (jsxRuntime.jsxs(react.Text, { fontSize: "sm", children: ["Dofollow: +", profile.additionalPriceDofollow, "\u20AC"] }))] })] }))] })] }, profile.id ?? index))) })), jsxRuntime.jsxs(react.Flex, { justify: "space-between", mt: 4, children: [jsxRuntime.jsx(react.Button, { onClick: handleCreateNewProfile, colorScheme: "blue", variant: "outline", children: "Cr\u00E9er un nouveau profil" }), jsxRuntime.jsx(ContinueButton.ContinueButton, { onContinue: handleContinue, title: "Continuer avec ce profil", backTitle: translations.selectHeaderStep.backButtonTitle, isLoading: isLoading, onBack: onBack, disabled: !selectedProfile })] }), jsxRuntime.jsxs(react.Modal, { isOpen: isOpen, onClose: onClose, size: "6xl", children: [jsxRuntime.jsx(react.ModalOverlay, {}), jsxRuntime.jsxs(react.ModalContent, { children: [jsxRuntime.jsx(react.ModalHeader, { children: isEditing ? "Modifier le profil" : "Créer un nouveau profil" }), jsxRuntime.jsx(react.ModalCloseButton, {}), jsxRuntime.jsx(react.ModalBody, { children: jsxRuntime.jsxs("div", { style: { display: "flex", gap: "24px" }, children: [jsxRuntime.jsxs(react.Box, { mb: 6, children: [jsxRuntime.jsx(react.Heading, { size: "md", mb: 4, children: "Informations G\u00E9n\u00E9rales" }), jsxRuntime.jsxs(react.SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Nom du profil" }), jsxRuntime.jsx(react.Input, { value: newProfile.name || "", onChange: (e) => handleInputChange("name", e.target.value), placeholder: "Mon profile SEO" })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Dur\u00E9e de validit\u00E9" }), jsxRuntime.jsxs(react.Select, { value: newProfile.validityDuration ?? "", onChange: (e) => handleInputChange("validityDuration", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "FOREVER", children: "Pour toujours" }), jsxRuntime.jsx("option", { value: "SIX_MONTHS", children: "6 mois" }), jsxRuntime.jsx("option", { value: "TWELVE_MONTHS", children: "12 mois" }), jsxRuntime.jsx("option", { value: "TWENTY_FOUR_MONTHS", children: "24 mois" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Type" }), jsxRuntime.jsxs(react.Select, { value: newProfile.type ?? "", onChange: (e) => handleInputChange("type", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "type")?.fieldType?.options?.map((option) => (jsxRuntime.jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Langues" }), jsxRuntime.jsxs(react.Select, { value: newProfile.languages ?? "", onChange: (e) => handleInputChange("languages", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "languages")?.fieldType?.options?.map((option) => (jsxRuntime.jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Theme" }), jsxRuntime.jsxs(react.Select, { value: newProfile.themes ?? "", onChange: (e) => handleInputChange("themes", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "themes")?.fieldType?.options?.map((option) => (jsxRuntime.jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Pays" }), jsxRuntime.jsxs(react.Select, { value: newProfile.targetCountries ?? "", onChange: (e) => handleInputChange("targetCountries", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), fields.find((elm) => elm.key == "targetCountries")?.fieldType?.options?.map((option) => (jsxRuntime.jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Cat\u00E9gorie" }), jsxRuntime.jsxs(react.Select, { value: newProfile.category ?? "", onChange: (e) => handleInputChange("category", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "IMPOSED", children: "Impos\u00E9e" }), jsxRuntime.jsx("option", { value: "IMPOSED_CATEGORY", children: "Cat\u00E9gorie impos\u00E9e" }), jsxRuntime.jsx("option", { value: "NOT_IMPOSED", children: "Non impos\u00E9e" })] })] }), (newProfile.category === "IMPOSED" || newProfile.category === "IMPOSED_CATEGORY") && (jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "URL de la cat\u00E9gorie" }), jsxRuntime.jsx(react.Input, { value: newProfile.categoryUrl || "", onChange: (e) => handleInputChange("categoryUrl", e.target.value) })] })), jsxRuntime.jsxs(react.SimpleGrid, { columns: 2, spacing: 4, gridColumn: [null, null, "span 2"], children: [jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Catalogue priv\u00E9 ?" }), jsxRuntime.jsxs(react.Select, { value: newProfile.isPrivate === undefined ? "" : String(newProfile.isPrivate), onChange: (e) => {
                                                                                const value = e.target.value;
                                                                                handleInputChange("isPrivate", value === "" ? undefined : value === "true");
                                                                            }, children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "true", children: "Oui" }), jsxRuntime.jsx("option", { value: "false", children: "Non" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Google News ?" }), jsxRuntime.jsxs(react.Select, { value: newProfile.isGoogleNews === undefined ? "" : String(newProfile.isGoogleNews), onChange: (e) => {
                                                                                const value = e.target.value;
                                                                                handleInputChange("isGoogleNews", value === "" ? undefined : value === "true");
                                                                            }, children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "true", children: "Oui" }), jsxRuntime.jsx("option", { value: "false", children: "Non" })] })] })] })] })] }), jsxRuntime.jsxs(react.Box, { mb: 6, children: [jsxRuntime.jsx(react.Heading, { size: "md", mb: 4, children: "Prix" }), jsxRuntime.jsxs(react.SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Prix sans r\u00E9daction" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.priceWithoutRedaction || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("priceWithoutRedaction", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Prix avec r\u00E9daction" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.priceWithRedaction || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("priceWithRedaction", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Prix pour 100 mots suppl\u00E9mentaires" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.pricePer100Words || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("pricePer100Words", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsx(react.Box, { gridColumn: [null, null, "span 2"], children: jsxRuntime.jsx(react.Heading, { size: "sm", my: 3, children: "Prix additionnels par niche" }) }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Crypto" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceCrypto || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCrypto", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Sant\u00E9" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceHealth || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceHealth", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "CBD" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceCBD || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCBD", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Casino" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceCasino || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceCasino", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Finance" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceFinance || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceFinance", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Sexe" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionnalPriceSex || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionnalPriceSex", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Prix additionnel pour sponsored" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionalPriceSponso || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionalPriceSponso", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Prix additionnel pour dofollow" }), jsxRuntime.jsxs(react.InputGroup, { children: [jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.additionalPriceDofollow || "", width: "100%", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("additionalPriceDofollow", e.target.value === "" ? undefined : parseFloat(e.target.value)) }) }), jsxRuntime.jsx(react.InputRightAddon, { children: "\u20AC" })] })] })] })] }), jsxRuntime.jsxs(react.Box, { children: [jsxRuntime.jsx(react.Heading, { size: "md", mb: 4, children: "Contenu" }), jsxRuntime.jsxs(react.SimpleGrid, { columns: [1, null, 2], spacing: 4, children: [jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Nombre de mots" }), jsxRuntime.jsx(react.NumberInput, { min: 1, value: newProfile.nbWords ?? "", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("nbWords", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Type de r\u00E9daction" }), jsxRuntime.jsxs(react.Select, { value: newProfile.redactionType ?? "", onChange: (e) => handleInputChange("redactionType", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "HUMAN", children: "Humain" }), jsxRuntime.jsx("option", { value: "AI", children: "IA" }), jsxRuntime.jsx("option", { value: "MIXED", children: "Mixte" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Nombre max. de liens client" }), jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.nbMaxLinksClient ?? "", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("nbMaxLinksClient", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Nombre max. de liens externes" }), jsxRuntime.jsx(react.NumberInput, { min: 0, value: newProfile.nbMaxLinksExternal ?? "", children: jsxRuntime.jsx(react.NumberInputField, { onChange: (e) => handleInputChange("nbMaxLinksExternal", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined) }) })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Type de lien" }), jsxRuntime.jsxs(react.Select, { value: newProfile.linkType ?? "", onChange: (e) => handleInputChange("linkType", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "DO_FOLLOW", children: "Do Follow" }), jsxRuntime.jsx("option", { value: "NO_FOLLOW", children: "No Follow" }), jsxRuntime.jsx("option", { value: "BOTH", children: "Les deux" })] })] }), jsxRuntime.jsxs(react.FormControl, { children: [jsxRuntime.jsx(react.FormLabel, { children: "Mention sponsoris\u00E9" }), jsxRuntime.jsxs(react.Select, { value: newProfile.sponso ?? "", onChange: (e) => handleInputChange("sponso", e.target.value), children: [jsxRuntime.jsx("option", { value: "", disabled: true, hidden: true, children: "Choisir..." }), jsxRuntime.jsx("option", { value: "SPONSO", children: "Sponsoris\u00E9" }), jsxRuntime.jsx("option", { value: "NO_SPONSO", children: "Non sponsoris\u00E9" }), jsxRuntime.jsx("option", { value: "BOTH", children: "Les deux" })] })] })] })] })] }) }), jsxRuntime.jsxs(react.ModalFooter, { children: [jsxRuntime.jsx(react.Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Annuler" }), jsxRuntime.jsx(react.Button, { colorScheme: "blue", onClick: handleSaveProfile, children: isEditing ? "Enregistrer les modifications" : "Créer le profil" })] })] })] })] }));
};

exports.SelectEditorProfileStep = SelectEditorProfileStep;
