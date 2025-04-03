import { useState, useCallback, useEffect } from "react"
import {
  Box,
  Button,
  Heading,
  ModalBody,
  Text,
  useStyleConfig,
  Flex,
  VStack,
  HStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Switch,
  CheckboxGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightAddon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import { useRsi } from "../../hooks/useRsi"

import type { themeOverrides } from "../../theme"
import { ContinueButton } from "../../components/ContinueButton"

export type Profile = {
  id?: string
  organizationId?: string
  name?: string | undefined
  type?: string | undefined
  themes: string | undefined
  languages: string | undefined
  targetCountries: string | undefined
  linkType: "DO_FOLLOW" | "NO_FOLLOW" | "BOTH" | undefined
  nbMaxLinksClient: number | undefined
  nbMaxLinksExternal: number | undefined
  nbWords: number | undefined
  sponso: "SPONSO" | "NO_SPONSO" | "BOTH" | undefined
  isPrivate: string | undefined
  isGoogleNews: string | undefined
  validityDuration: "FOREVER" | "SIX_MONTHS" | "TWELVE_MONTHS" | "TWENTY_FOUR_MONTHS" | undefined
  category: "IMPOSED" | "IMPOSED_CATEGORY" | "NOT_IMPOSED" | undefined
  categoryUrl: string | undefined
  redactionType: "HUMAN" | "AI" | "MIXED" | undefined
  priceWithoutRedaction: number | undefined
  priceWithRedaction: number | undefined
  additionnalPriceRedaction: number | undefined
  additionnalPriceCrypto: number | undefined
  additionnalPriceHealth: number | undefined
  additionnalPriceCBD: number | undefined
  additionnalPriceSex: number | undefined
  additionnalPriceFinance: number | undefined
  additionnalPriceCasino: number | undefined
  additionalPriceSponso: number | undefined
  additionalPriceDofollow: number | undefined
  pricePer100Words: number | undefined
}

// Define a type for the array fields we know exist in Profile
type ProfileArrayField = "themes" | "languages" | "targetCountries"

// Make sure field is definitely one of these array fields
function isProfileArrayField(field: string): field is ProfileArrayField {
  return ["themes", "languages", "targetCountries"].includes(field)
}

type SelectEditorProfileStepProps = {
  onContinue: (profile: Profile) => Promise<void>
  organization: any
  onBack?: () => void
}

// Sample default profile for new profile creation
const DEFAULT_PROFILE: Profile = {
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
}

// Helper function to format enum values for display
const formatEnumValue = (value: string | undefined): any => {
  if (value) {
    return value
      .split("_")
      ?.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  } else {
    return undefined
  }
}

export const SelectEditorProfileStep = ({ onContinue, organization, onBack }: SelectEditorProfileStepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newProfile, setNewProfile] = useState<Profile>({ ...DEFAULT_PROFILE })
  const [tempInput, setTempInput] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentField, setCurrentField] = useState<"themes" | "languages" | "targetCountries">("themes")

  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const { getProfiles, translations, saveProfiles, fields } = useRsi()

  useEffect(() => {
    getProfiles(organization.id).then((response) => {
      setProfiles(response.data.data)
    })
  }, [])

  const handleContinue = useCallback(async () => {
    console.log(selectedProfile)
    if (!selectedProfile) return

    setIsLoading(true)
    await onContinue(selectedProfile)
    setIsLoading(false)
  }, [onContinue, selectedProfile])

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile)
  }

  const handleInputChange = (field: keyof Profile, value: any) => {
    setNewProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    // Add an ID and name if not provided for new profiles
    const profileToSave = {
      ...newProfile,
      organizationId: organization.id,
      id: newProfile?.id,
      name: newProfile.name || `Profile ${profiles.length + 1}`,
    }

    try {
      const response = await saveProfiles(organization.id, profileToSave)

      if (isEditing) {
        // Update the profiles list with the edited profile
        setProfiles((prev) => prev.map((p) => (p.id === response.data.data.id ? response.data.data : p)))
        // If the edited profile was the selected one, update the selection
      } else {
        // Add the new profile to the list
        setProfiles((prev) => [...prev, response.data.data])
      }

      // Close the modal and reset editing state
      onClose()
      setIsEditing(false)
    } catch (error) {
      alert("Erreur lors de la sauvegarde du profil")
      console.error(error)
    }
  }

  const handleEditProfile = (profile: Profile, e: React.MouseEvent) => {
    // Prevent triggering the profile selection when clicking the edit button
    e.stopPropagation()

    // Set the profile to edit, ensuring array fields exist
    setNewProfile({
      ...profile,
    })
    setIsEditing(true)
    onOpen()
  }

  const handleCreateNewProfile = () => {
    setNewProfile({
      ...DEFAULT_PROFILE,
    })
    setIsEditing(false)
    onOpen()
  }

  // Helpers for tag inputs

  // Get badge color based on link type
  const getLinkTypeBadgeColor = (linkType: Profile["linkType"]) => {
    switch (linkType) {
      case "DO_FOLLOW":
        return "green"
      case "NO_FOLLOW":
        return "orange"
      case "BOTH":
        return "blue"
      default:
        return "gray"
    }
  }

  // Get badge color based on sponsorship
  const getSponsoBadgeColor = (sponso: Profile["sponso"]) => {
    switch (sponso) {
      case "SPONSO":
        return "purple"
      case "NO_SPONSO":
        return "gray"
      case "BOTH":
        return "teal"
      default:
        return "gray"
    }
  }

  return (
    <ModalBody>
      <Heading sx={styles.heading}>Choisir un profil d&apos;import</Heading>

      {profiles.length === 0 ? (
        <Text mb={4}>Aucun profil disponible</Text>
      ) : (
        <VStack spacing={3} align="stretch" mb={6} maxHeight="300px" overflowY="auto">
          {profiles.map((profile, index) => (
            <Box
              key={profile.id ?? index}
              p={5}
              mb={4}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              bg={selectedProfile === profile ? "blue.50" : "white"}
              borderColor={selectedProfile === profile ? "blue.500" : "gray.200"}
              onClick={() => handleProfileSelect(profile)}
              position="relative"
              boxShadow="sm"
            >
              {/* Bouton de modification */}
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                position="absolute"
                top={3}
                right={3}
                onClick={(e) => handleEditProfile(profile, e)}
              >
                Modifier
              </Button>

              <Flex direction="column" gap={4} pt={2}>
                {/* En-tête avec nom et prix */}
                <Flex justify="space-between" align="baseline" wrap="wrap">
                  <Heading size="md" mb={2}>
                    {profile.name ?? `Profil ${index + 1}`}
                  </Heading>
                  <HStack spacing={3} mb={2}>
                    {profile.priceWithoutRedaction != null && (
                      <Text fontSize="sm" color="gray.600">
                        Sans rédaction: <span style={{ fontWeight: "bold" }}>{profile.priceWithoutRedaction}€</span>
                      </Text>
                    )}
                    {profile.priceWithRedaction != null && (
                      <Text fontSize="md" color="blue.600" fontWeight="bold">
                        Avec rédaction: {profile.priceWithRedaction}€
                      </Text>
                    )}
                  </HStack>
                </Flex>

                {/* Informations principales en deux colonnes */}
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  {/* Colonne gauche */}
                  <Box>
                    {/* Badges principaux */}
                    <Flex wrap="wrap" gap={2} mb={4}>
                      <Badge colorScheme={profile.isGoogleNews ? "green" : "gray"} px={2} py={1}>
                        {profile.isGoogleNews ? "Google News" : "Hors Google News"}
                      </Badge>
                      <Badge colorScheme={getLinkTypeBadgeColor(profile.linkType)} px={2} py={1}>
                        {formatEnumValue(profile.linkType) ?? "Type de lien non spécifié"}
                      </Badge>
                      <Badge colorScheme={getSponsoBadgeColor(profile.sponso)} px={2} py={1}>
                        {formatEnumValue(profile.sponso) ?? "Mention sponso non spécifiée"}
                      </Badge>
                      <Badge colorScheme={profile.isPrivate ? "red" : "green"} px={2} py={1}>
                        {profile.isPrivate ? "Privé" : "Public"}
                      </Badge>
                    </Flex>

                    {/* Caractéristiques */}
                    <Stack spacing={2}>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Type de rédaction:
                        </Text>
                        <Text fontSize="sm">{formatEnumValue(profile.redactionType) ?? "Non spécifié"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Nombre de mots:
                        </Text>
                        <Text fontSize="sm">{profile.nbWords ?? "Non spécifié"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Catégorie:
                        </Text>
                        <Text fontSize="sm">{formatEnumValue(profile.category) ?? "Non spécifiée"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Durée de validité:
                        </Text>
                        <Text fontSize="sm">{formatEnumValue(profile.validityDuration) ?? "Non spécifiée"}</Text>
                      </Flex>
                    </Stack>
                  </Box>

                  {/* Colonne droite */}
                  <Box>
                    {/* Liens */}
                    <Box mb={4}>
                      <Text fontSize="sm" fontWeight="semibold" mb={1}>
                        Liens autorisés
                      </Text>
                      <Flex gap={4}>
                        <Text fontSize="sm">Client: max {profile.nbMaxLinksClient ?? "?"}</Text>
                        <Text fontSize="sm">Externe: max {profile.nbMaxLinksExternal ?? "?"}</Text>
                      </Flex>
                    </Box>

                    {/* Informations géographiques */}
                    <Stack spacing={2}>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Pays cible:
                        </Text>
                        <Text fontSize="sm">{profile.targetCountries ?? "Non spécifié"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Langue:
                        </Text>
                        <Text fontSize="sm">{profile.languages ?? "Non spécifié"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Type de site:
                        </Text>
                        <Text fontSize="sm">{profile.type ?? "Non spécifié"}</Text>
                      </Flex>
                      <Flex>
                        <Text fontSize="sm" fontWeight="semibold" w="40%">
                          Thème:
                        </Text>
                        <Text fontSize="sm">{profile.themes ?? "Non spécifié"}</Text>
                      </Flex>
                    </Stack>
                  </Box>
                </SimpleGrid>

                {/* Frais additionnels - affichés uniquement si présents */}
                {(profile.pricePer100Words != null ||
                  profile.additionnalPriceCrypto != null ||
                  profile.additionnalPriceHealth != null ||
                  profile.additionnalPriceCBD != null ||
                  profile.additionnalPriceSex != null ||
                  profile.additionnalPriceFinance != null ||
                  profile.additionnalPriceCasino != null ||
                  profile.additionalPriceSponso != null ||
                  profile.additionalPriceDofollow != null) && (
                  <Box borderTopWidth="1px" pt={3} mt={2}>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Frais supplémentaires
                    </Text>
                    <SimpleGrid columns={[2, 3, 4]} spacing={3}>
                      {profile.pricePer100Words != null && (
                        <Text fontSize="sm">100 mots: +{profile.pricePer100Words}€</Text>
                      )}
                      {profile.additionnalPriceCrypto != null && (
                        <Text fontSize="sm">Crypto: +{profile.additionnalPriceCrypto}€</Text>
                      )}
                      {profile.additionnalPriceHealth != null && (
                        <Text fontSize="sm">Santé: +{profile.additionnalPriceHealth}€</Text>
                      )}
                      {profile.additionnalPriceCBD != null && (
                        <Text fontSize="sm">CBD: +{profile.additionnalPriceCBD}€</Text>
                      )}
                      {profile.additionnalPriceSex != null && (
                        <Text fontSize="sm">Sexe: +{profile.additionnalPriceSex}€</Text>
                      )}
                      {profile.additionnalPriceFinance != null && (
                        <Text fontSize="sm">Finance: +{profile.additionnalPriceFinance}€</Text>
                      )}
                      {profile.additionnalPriceCasino != null && (
                        <Text fontSize="sm">Casino: +{profile.additionnalPriceCasino}€</Text>
                      )}
                      {profile.additionalPriceSponso != null && (
                        <Text fontSize="sm">Sponsorisé: +{profile.additionalPriceSponso}€</Text>
                      )}
                      {profile.additionalPriceDofollow != null && (
                        <Text fontSize="sm">Dofollow: +{profile.additionalPriceDofollow}€</Text>
                      )}
                    </SimpleGrid>
                  </Box>
                )}
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      <Flex justify="space-between" mt={4}>
        <Button onClick={handleCreateNewProfile} colorScheme="blue" variant="outline">
          Créer un nouveau profil
        </Button>

        <ContinueButton
          onContinue={handleContinue}
          title="Continuer avec ce profil"
          backTitle={translations.selectHeaderStep.backButtonTitle}
          isLoading={isLoading}
          onBack={onBack}
          disabled={!selectedProfile}
        />
      </Flex>

      {/* Create/Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Modifier le profil" : "Créer un nouveau profil"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", gap: "24px" }}>
              <Box mb={6}>
                <Heading size="md" mb={4}>
                  Informations Générales
                </Heading>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <FormControl>
                    <FormLabel>Nom du profil</FormLabel>
                    <Input
                      value={newProfile.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Mon profile SEO"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Durée de validité</FormLabel>
                    <Select
                      value={newProfile.validityDuration ?? ""}
                      onChange={(e) =>
                        handleInputChange("validityDuration", e.target.value as Profile["validityDuration"])
                      }
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      <option value="FOREVER">Pour toujours</option>
                      <option value="SIX_MONTHS">6 mois</option>
                      <option value="TWELVE_MONTHS">12 mois</option>
                      <option value="TWENTY_FOUR_MONTHS">24 mois</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={newProfile.type ?? ""}
                      onChange={(e) => handleInputChange("type", e.target.value as Profile["themes"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      {(fields.find((elm: any) => elm.key == "type")?.fieldType as any)?.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Langues</FormLabel>
                    <Select
                      value={newProfile.languages ?? ""}
                      onChange={(e) => handleInputChange("languages", e.target.value as Profile["languages"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      {(fields.find((elm: any) => elm.key == "languages")?.fieldType as any)?.options?.map(
                        (option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      value={newProfile.themes ?? ""}
                      onChange={(e) => handleInputChange("themes", e.target.value as Profile["themes"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      {(fields.find((elm: any) => elm.key == "themes")?.fieldType as any)?.options?.map(
                        (option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Pays</FormLabel>
                    <Select
                      value={newProfile.targetCountries ?? ""}
                      onChange={(e) =>
                        handleInputChange("targetCountries", e.target.value as Profile["targetCountries"])
                      }
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      {(fields.find((elm: any) => elm.key == "targetCountries")?.fieldType as any)?.options?.map(
                        (option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      value={newProfile.category ?? ""}
                      onChange={(e) => handleInputChange("category", e.target.value as Profile["category"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      <option value="IMPOSED">Imposée</option>
                      <option value="IMPOSED_CATEGORY">Catégorie imposée</option>
                      <option value="NOT_IMPOSED">Non imposée</option>
                    </Select>
                  </FormControl>

                  {(newProfile.category === "IMPOSED" || newProfile.category === "IMPOSED_CATEGORY") && (
                    <FormControl>
                      <FormLabel>URL de la catégorie</FormLabel>
                      <Input
                        value={newProfile.categoryUrl || ""}
                        onChange={(e) => handleInputChange("categoryUrl", e.target.value)}
                      />
                    </FormControl>
                  )}

                  <SimpleGrid columns={2} spacing={4} gridColumn={[null, null, "span 2"]}>
                    <FormControl>
                      <FormLabel>Catalogue privé ?</FormLabel>
                      <Select
                        value={newProfile.isPrivate === undefined ? "" : String(newProfile.isPrivate)}
                        onChange={(e) => {
                          const value = e.target.value
                          handleInputChange("isPrivate", value === "" ? undefined : value === "true")
                        }}
                      >
                        <option value="" disabled hidden>
                          Choisir...
                        </option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Google News ?</FormLabel>
                      <Select
                        value={newProfile.isGoogleNews === undefined ? "" : String(newProfile.isGoogleNews)}
                        onChange={(e) => {
                          const value = e.target.value
                          handleInputChange("isGoogleNews", value === "" ? undefined : value === "true")
                        }}
                      >
                        <option value="" disabled hidden>
                          Choisir...
                        </option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </SimpleGrid>
              </Box>

              {/* Pricing Section */}
              <Box mb={6}>
                <Heading size="md" mb={4}>
                  Prix
                </Heading>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <FormControl>
                    <FormLabel>Prix sans rédaction</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.priceWithoutRedaction || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "priceWithoutRedaction",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Prix avec rédaction</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.priceWithRedaction || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "priceWithRedaction",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Prix pour 100 mots supplémentaires</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.pricePer100Words || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "pricePer100Words",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <Box gridColumn={[null, null, "span 2"]}>
                    <Heading size="sm" my={3}>
                      Prix additionnels par niche
                    </Heading>
                  </Box>

                  <FormControl>
                    <FormLabel>Crypto</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceCrypto || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceCrypto",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Santé</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceHealth || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceHealth",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>CBD</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceCBD || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceCBD",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Casino</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceCasino || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceCasino",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Finance</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceFinance || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceFinance",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sexe</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionnalPriceSex || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionnalPriceSex",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Prix additionnel pour sponsored</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionalPriceSponso || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionalPriceSponso",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Prix additionnel pour dofollow</FormLabel>
                    <InputGroup>
                      <NumberInput min={0} value={newProfile.additionalPriceDofollow || ""} width="100%">
                        <NumberInputField
                          onChange={(e) =>
                            handleInputChange(
                              "additionalPriceDofollow",
                              e.target.value === "" ? undefined : parseFloat(e.target.value),
                            )
                          }
                        />
                      </NumberInput>
                      <InputRightAddon>€</InputRightAddon>
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Content Section */}
              <Box>
                <Heading size="md" mb={4}>
                  Contenu
                </Heading>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <FormControl>
                    <FormLabel>Nombre de mots</FormLabel>
                    <NumberInput min={1} value={newProfile.nbWords ?? ""}>
                      <NumberInputField
                        onChange={(e) =>
                          handleInputChange(
                            "nbWords",
                            e.target.value === "" ? undefined : parseInt(e.target.value) || undefined,
                          )
                        }
                      />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Type de rédaction</FormLabel>
                    <Select
                      value={newProfile.redactionType ?? ""}
                      onChange={(e) => handleInputChange("redactionType", e.target.value as Profile["redactionType"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      <option value="HUMAN">Humain</option>
                      <option value="AI">IA</option>
                      <option value="MIXED">Mixte</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Nombre max. de liens client</FormLabel>
                    <NumberInput min={0} value={newProfile.nbMaxLinksClient ?? ""}>
                      <NumberInputField
                        onChange={(e) =>
                          handleInputChange(
                            "nbMaxLinksClient",
                            e.target.value === "" ? undefined : parseInt(e.target.value) || undefined,
                          )
                        }
                      />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Nombre max. de liens externes</FormLabel>
                    <NumberInput min={0} value={newProfile.nbMaxLinksExternal ?? ""}>
                      <NumberInputField
                        onChange={(e) =>
                          handleInputChange(
                            "nbMaxLinksExternal",
                            e.target.value === "" ? undefined : parseInt(e.target.value) || undefined,
                          )
                        }
                      />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Type de lien</FormLabel>
                    <Select
                      value={newProfile.linkType ?? ""}
                      onChange={(e) => handleInputChange("linkType", e.target.value as Profile["linkType"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      <option value="DO_FOLLOW">Do Follow</option>
                      <option value="NO_FOLLOW">No Follow</option>
                      <option value="BOTH">Les deux</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Mention sponsorisé</FormLabel>
                    <Select
                      value={newProfile.sponso ?? ""}
                      onChange={(e) => handleInputChange("sponso", e.target.value as Profile["sponso"])}
                    >
                      <option value="" disabled hidden>
                        Choisir...
                      </option>
                      <option value="SPONSO">Sponsorisé</option>
                      <option value="NO_SPONSO">Non sponsorisé</option>
                      <option value="BOTH">Les deux</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={handleSaveProfile}>
              {isEditing ? "Enregistrer les modifications" : "Créer le profil"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalBody>
  )
}
