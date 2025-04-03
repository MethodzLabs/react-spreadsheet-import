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
} from "@chakra-ui/react"
import { useRsi } from "../../hooks/useRsi"

import type { themeOverrides } from "../../theme"
import { ContinueButton } from "../../components/ContinueButton"

export type Profile = {
  id?: string
  organizationId?: string
  name?: string | undefined
  themes: string[] | undefined
  languages: string[] | undefined
  targetCountries: string[] | undefined
  linkType: "DO_FOLLOW" | "NO_FOLLOW" | "BOTH" | undefined
  nbMaxLinksClient: number | undefined
  nbMaxLinksExternal: number | undefined
  nbWords: number | undefined
  sponso: "SPONSO" | "NO_SPONSO" | "BOTH" | undefined
  isPrivate: boolean | undefined
  isGoogleNews: boolean | undefined
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
  themes: [],
  languages: [],
  targetCountries: [],
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
  const { getProfiles, translations, saveProfiles } = useRsi()

  useEffect(() => {
    getProfiles(organization.id).then((response) => {
      setProfiles(response.data.data)
    })
  }, [])

  const handleContinue = useCallback(async () => {
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
      // Ensure array fields are not undefined
      themes: newProfile.themes || [],
      languages: newProfile.languages || [],
      targetCountries: newProfile.targetCountries || [],
    }

    try {
      const response = await saveProfiles(organization.id, profileToSave)

      if (isEditing) {
        // Update the profiles list with the edited profile
        setProfiles((prev) => prev.map((p) => (p.id === response.data.data.id ? response.data.data : p)))
        // If the edited profile was the selected one, update the selection
        if (selectedProfile?.id === response.data.data.id) {
          setSelectedProfile(profileToSave)
        }
      } else {
        // Add the new profile to the list
        setProfiles((prev) => [...prev, response.data.data])
        setSelectedProfile(response.data.data)
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
      themes: profile.themes || [],
      languages: profile.languages || [],
      targetCountries: profile.targetCountries || [],
    })
    setIsEditing(true)
    onOpen()
  }

  const handleCreateNewProfile = () => {
    setNewProfile({
      ...DEFAULT_PROFILE,
      themes: [],
      languages: [],
      targetCountries: [],
    })
    setIsEditing(false)
    onOpen()
  }

  // Helpers for tag inputs
  const addItem = (field: "themes" | "languages" | "targetCountries") => {
    if (!tempInput.trim()) return
    setNewProfile((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), tempInput.trim()],
    }))
    setTempInput("")
  }

  const removeItem = (field: "themes" | "languages" | "targetCountries", index: number) => {
    setNewProfile((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

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
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              bg={selectedProfile === profile ? "blue.50" : "white"}
              borderColor={selectedProfile === profile ? "blue.500" : "gray.200"}
              onClick={() => handleProfileSelect(profile)}
              position="relative"
            >
              {/* Edit button positioned in the top-right corner */}
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                position="absolute"
                top={2}
                right={2}
                onClick={(e) => handleEditProfile(profile, e)}
              >
                Modifier
              </Button>

              <Flex direction="column" gap={3} pt={6}>
                {/* Header with name and price */}
                <Flex justify="space-between" align="center">
                  <Heading size="md">{profile.name ?? `Profil ${index + 1}`}</Heading>
                  <HStack spacing={2}>
                    {profile.priceWithoutRedaction != null && (
                      <Text fontSize="sm" color="gray.500">
                        Sans rédaction: {profile.priceWithoutRedaction}€
                      </Text>
                    )}
                    {profile.priceWithRedaction != null && (
                      <Text fontWeight="bold" color="blue.500">
                        Avec rédaction: {profile.priceWithRedaction}€
                      </Text>
                    )}
                  </HStack>
                </Flex>

                {/* Main badges row */}
                <Flex wrap="wrap" gap={2}>
                  <Badge colorScheme={profile.isGoogleNews ? "green" : "gray"}>
                    {profile.isGoogleNews ? "Présent sur Google News" : "Non présent sur Google News"}
                  </Badge>
                  <Badge colorScheme={getLinkTypeBadgeColor(profile.linkType)}>
                    {formatEnumValue(profile.linkType) ?? "Non spécifié"}
                  </Badge>
                  <Badge colorScheme={getSponsoBadgeColor(profile.sponso)}>
                    {formatEnumValue(profile.sponso) ?? "Non spécifié"}
                  </Badge>
                  <Badge colorScheme={profile.isPrivate ? "red" : "gray"}>
                    {profile.isPrivate ? "Privé" : "Public"}
                  </Badge>
                  <Badge colorScheme="blue">
                    {profile.nbWords != null ? `${profile.nbWords} mots` : "Nombre de mots inconnu"}
                  </Badge>
                  <Badge colorScheme="purple">{formatEnumValue(profile.redactionType) ?? "Non spécifié"}</Badge>
                </Flex>

                {/* Links and word details */}
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Liens
                    </Text>
                    <Text fontSize="sm">Client: max {profile.nbMaxLinksClient ?? "?"}</Text>
                    <Text fontSize="sm">Externe: max {profile.nbMaxLinksExternal ?? "?"}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Catégorie
                    </Text>
                    <Text fontSize="sm">{formatEnumValue(profile.category) ?? "Non spécifiée"}</Text>
                    {profile.categoryUrl && (
                      <Text fontSize="sm" noOfLines={1}>
                        URL: {profile.categoryUrl}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Validité
                    </Text>
                    <Text fontSize="sm">{formatEnumValue(profile.validityDuration) ?? "Non spécifiée"}</Text>
                  </Box>
                </SimpleGrid>

                {/* Arrays as tag lists */}
                <SimpleGrid columns={[1, 3]} spacing={4}>
                  {["themes", "languages", "targetCountries"].map((field) => (
                    <Box key={field}>
                      <Text fontSize="sm" fontWeight="semibold">
                        {formatEnumValue(field)}
                      </Text>
                      <Flex flexWrap="wrap" gap={1} mt={1}>
                        {field in profile &&
                        Array.isArray(profile[field as keyof Profile]) &&
                        (profile[field as keyof Profile] as string[])?.length > 0 ? (
                          (profile[field as keyof Profile] as string[])?.map((item: string, i: number) => (
                            <Tag size="sm" key={i} colorScheme="gray">
                              {item}
                            </Tag>
                          ))
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            Aucun
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Additional pricing section */}
                {(profile.pricePer100Words != null ||
                  profile.additionnalPriceCrypto != null ||
                  profile.additionnalPriceHealth != null ||
                  profile.additionnalPriceCBD != null ||
                  profile.additionnalPriceSex != null ||
                  profile.additionnalPriceFinance != null ||
                  profile.additionnalPriceCasino != null ||
                  profile.additionalPriceSponso != null ||
                  profile.additionalPriceDofollow != null) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Tarifs additionnels
                    </Text>
                    <SimpleGrid columns={[2, 3, 4]} spacing={2}>
                      {profile.pricePer100Words != null && (
                        <Text fontSize="xs">100 mots: {profile.pricePer100Words}€</Text>
                      )}
                      {profile.additionnalPriceCrypto != null && (
                        <Text fontSize="xs">Crypto: +{profile.additionnalPriceCrypto}€</Text>
                      )}
                      {profile.additionnalPriceHealth != null && (
                        <Text fontSize="xs">Santé: +{profile.additionnalPriceHealth}€</Text>
                      )}
                      {profile.additionnalPriceCBD != null && (
                        <Text fontSize="xs">CBD: +{profile.additionnalPriceCBD}€</Text>
                      )}
                      {profile.additionnalPriceSex != null && (
                        <Text fontSize="xs">Sexe: +{profile.additionnalPriceSex}€</Text>
                      )}
                      {profile.additionnalPriceFinance != null && (
                        <Text fontSize="xs">Finance: +{profile.additionnalPriceFinance}€</Text>
                      )}
                      {profile.additionnalPriceCasino != null && (
                        <Text fontSize="xs">Casino: +{profile.additionnalPriceCasino}€</Text>
                      )}
                      {profile.additionalPriceSponso != null && (
                        <Text fontSize="xs">Sponsorisé: +{profile.additionalPriceSponso}€</Text>
                      )}
                      {profile.additionalPriceDofollow != null && (
                        <Text fontSize="xs">Dofollow: +{profile.additionalPriceDofollow}€</Text>
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

                  {["themes", "languages", "targetCountries"].map((field) => (
                    <FormControl key={field} gridColumn={[null, null, "span 2"]}>
                      <FormLabel>{formatEnumValue(field)}</FormLabel>
                      <Flex mb={2} wrap="wrap">
                        {isProfileArrayField(field) &&
                          (newProfile[field] || []).map((item, index) => (
                            <Tag
                              size="md"
                              key={index}
                              borderRadius="full"
                              variant="solid"
                              colorScheme={field === "themes" ? "blue" : field === "languages" ? "green" : "purple"}
                              m={1}
                            >
                              <TagLabel>{item}</TagLabel>
                              <TagCloseButton onClick={() => removeItem(field, index)} />
                            </Tag>
                          ))}
                      </Flex>
                      <InputGroup>
                        <Input
                          value={field === currentField ? tempInput : ""}
                          onChange={(e) => {
                            setCurrentField(field as any)
                            setTempInput(e.target.value)
                          }}
                          placeholder={`Ajouter ${
                            field === "themes" ? "un thème" : field === "languages" ? "une langue" : "un pays"
                          }`}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              setCurrentField(field as any)
                              addItem(field as any)
                            }
                          }}
                          onFocus={() => setCurrentField(field as any)}
                        />
                        <InputRightAddon>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentField(field as any)
                              addItem(field as any)
                            }}
                          >
                            +
                          </Button>
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>
                  ))}

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
