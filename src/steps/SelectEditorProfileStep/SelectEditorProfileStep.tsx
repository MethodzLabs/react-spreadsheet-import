import { useState, useCallback, useEffect } from "react";
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
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel, SimpleGrid,
} from "@chakra-ui/react"
import { useRsi } from "../../hooks/useRsi";

import type { themeOverrides } from "../../theme";
import { ContinueButton } from "../../components/ContinueButton";

export type Profile = {
  id?: string;
  name?: string;
  themes: string[];
  languages: string[];
  targetCountries: string[];
  linkType: 'DO_FOLLOW' | 'NO_FOLLOW' | 'BOTH';
  nbMaxLinksClient: number;
  nbMaxLinksExternal: number;
  nbWords: number;
  sponso: "SPONSO" | "NO_SPONSO" | "BOTH";
  isPrivate: boolean;
  isGoogleNews: boolean;
  validityDuration: "FOREVER" | "SIX_MONTHS" | "TWELVE_MONTHS" | "TWENTY_FOUR_MONTHS";
  category: "IMPOSED" | "IMPOSED_CATEGORY" | "NOT_IMPOSED";
  categoryUrl: string | null;
  redactionType: "HUMAN" | "AI" | "MIXED";
  priceWithoutRedaction: number | null;
  priceWithRedaction: number | null;
  additionnalPriceCrypto: number | null;
  additionnalPriceHealth: number | null;
  additionnalPriceCBD: number | null;
  additionnalPriceSex: number | null;
  additionnalPriceFinance: number | null;
  additionnalPriceCasino: number | null;
  additionalPriceSponso: number | null;
  additionalPriceDofollow: number | null;
  pricePer100Words: number | null;
};

type SelectEditorProfileStepProps = {
  onContinue: (profile: Profile) => Promise<void>;
  existingProfiles?: Profile[];
};

// Sample default profile for new profile creation
const DEFAULT_PROFILE: Profile = {
  themes: [],
  languages: [],
  targetCountries: [],
  linkType: 'DO_FOLLOW',
  nbMaxLinksClient: 1,
  nbMaxLinksExternal: 2,
  nbWords: 500,
  sponso: "NO_SPONSO",
  isPrivate: false,
  isGoogleNews: false,
  validityDuration: "FOREVER",
  category: "NOT_IMPOSED",
  categoryUrl: null,
  redactionType: "HUMAN",
  priceWithoutRedaction: null,
  priceWithRedaction: null,
  additionnalPriceCrypto: null,
  additionnalPriceHealth: null,
  additionnalPriceCBD: null,
  additionnalPriceSex: null,
  additionnalPriceFinance: null,
  additionnalPriceCasino: null,
  additionalPriceSponso: null,
  additionalPriceDofollow: null,
  pricePer100Words: null
};

// Helper function to format enum values for display
const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const SelectEditorProfileStep = ({ onContinue, existingProfiles = [] }: SelectEditorProfileStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(existingProfiles);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newProfile, setNewProfile] = useState<Profile>({...DEFAULT_PROFILE});
  const [tempInput, setTempInput] = useState<string>('');

  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"];
  const { translations, fields } = useRsi();

  const handleContinue = useCallback(async () => {
    if (!selectedProfile) return;

    setIsLoading(true);
    await onContinue(selectedProfile);
    setIsLoading(false);
  }, [onContinue, selectedProfile]);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setNewProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProfile = async () => {
    // Add an ID and name if not provided
    const profileToAdd = {
      ...newProfile,
      id: newProfile.id || `profile-${Date.now()}`,
      name: newProfile.name || `Profile ${profiles.length + 1}`
    };

    setProfiles(prev => [...prev, profileToAdd]);
    setSelectedProfile(profileToAdd);
    onClose();
  };

  // Helpers for tag inputs
  const addItem = (field: 'themes' | 'languages' | 'targetCountries') => {
    if (!tempInput.trim()) return;
    setNewProfile(prev => ({
      ...prev,
      [field]: [...prev[field], tempInput.trim()]
    }));
    setTempInput('');
  };

  const removeItem = (field: 'themes' | 'languages' | 'targetCountries', index: number) => {
    setNewProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Get badge color based on link type
  const getLinkTypeBadgeColor = (linkType: Profile['linkType']) => {
    switch (linkType) {
      case 'DO_FOLLOW': return 'green';
      case 'NO_FOLLOW': return 'orange';
      case 'BOTH': return 'blue';
      default: return 'gray';
    }
  };

  // Get badge color based on sponsorship
  const getSponsoBadgeColor = (sponso: Profile['sponso']) => {
    switch (sponso) {
      case 'SPONSO': return 'purple';
      case 'NO_SPONSO': return 'gray';
      case 'BOTH': return 'teal';
      default: return 'gray';
    }
  };

  // @ts-ignore
  return (
    <ModalBody>
      <Heading sx={styles.heading}>Choisir un profil d'import</Heading>

      {profiles.length === 0 ? (
        <Text mb={4}>Aucun profil disponible</Text>
      ) : (
        <VStack spacing={3} align="stretch" mb={6} maxHeight="300px" overflowY="auto">
          {profiles.map((profile, index) => (
            <Box
              key={profile.id || index}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              bg={selectedProfile === profile ? "blue.50" : "white"}
              borderColor={selectedProfile === profile ? "blue.500" : "gray.200"}
              onClick={() => handleProfileSelect(profile)}
            >
              <Flex direction="column" gap={3}>
                {/* Header with name and price */}
                <Flex justify="space-between" align="center">
                  <Heading size="md">{profile.name || `Profile ${index + 1}`}</Heading>
                  <HStack spacing={2}>
                    {profile.priceWithoutRedaction !== null && (
                      <Text fontSize="sm" color="gray.500">Sans rédaction: {profile.priceWithoutRedaction}€</Text>
                    )}
                    {profile.priceWithRedaction !== null && (
                      <Text fontWeight="bold" color="blue.500">Avec rédaction: {profile.priceWithRedaction}€</Text>
                    )}
                  </HStack>
                </Flex>

                {/* Main badges row */}
                <Flex wrap="wrap" gap={2}>
                  <Badge colorScheme={profile.isGoogleNews ? "green" : "gray"}>
                    {profile.isGoogleNews ? "présent sur Google News" : "Non présent sur Google News"}
                  </Badge>
                  <Badge colorScheme={getLinkTypeBadgeColor(profile.linkType)}>
                    {formatEnumValue(profile.linkType)}
                  </Badge>
                  <Badge colorScheme={getSponsoBadgeColor(profile.sponso)}>
                    {formatEnumValue(profile.sponso)}
                  </Badge>
                  <Badge colorScheme={profile.isPrivate ? "red" : "gray"}>
                    {profile.isPrivate ? "Privé" : "Public"}
                  </Badge>
                  <Badge colorScheme="blue">
                    {profile.nbWords} mots
                  </Badge>
                  <Badge colorScheme="purple">
                    {formatEnumValue(profile.redactionType)}
                  </Badge>
                </Flex>

                {/* Links and word details */}
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Liens</Text>
                    <Text fontSize="sm">Client: max {profile.nbMaxLinksClient}</Text>
                    <Text fontSize="sm">Externe: max {profile.nbMaxLinksExternal}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Catégorie</Text>
                    <Text fontSize="sm">{formatEnumValue(profile.category)}</Text>
                    {profile.categoryUrl && (
                      <Text fontSize="sm" noOfLines={1}>URL: {profile.categoryUrl}</Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Validité</Text>
                    <Text fontSize="sm">{formatEnumValue(profile.validityDuration)}</Text>
                  </Box>
                </SimpleGrid>

                {/* Arrays as tag lists */}
                <SimpleGrid columns={[1, 3]} spacing={4}>
                  {['themes', 'languages', 'targetCountries'].map((field) => (
                    <Box key={field}>
                      <Text fontSize="sm" fontWeight="semibold">{formatEnumValue(field)}</Text>
                      <Flex flexWrap="wrap" gap={1} mt={1}>
                        {profile[field].length > 0 ? (
                          profile[field].map((item, i) => (
                            <Tag size="sm" key={i} colorScheme="gray">
                              {item}
                            </Tag>
                          ))
                        ) : (
                          <Text fontSize="xs" color="gray.500">Aucun</Text>
                        )}
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Additional pricing section */}
                {(profile.additionnalPriceCrypto !== null ||
                  profile.additionnalPriceHealth !== null ||
                  profile.additionnalPriceCBD !== null ||
                  profile.additionnalPriceSex !== null ||
                  profile.additionnalPriceFinance !== null ||
                  profile.additionnalPriceCasino !== null ||
                  profile.additionalPriceSponso !== null ||
                  profile.additionalPriceDofollow !== null ||
                  profile.pricePer100Words !== null) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Tarifs additionnels</Text>
                    <SimpleGrid columns={[2, 3, 4]} spacing={2}>
                      {profile.pricePer100Words !== null && (
                        <Text fontSize="xs">100 mots: {profile.pricePer100Words}€</Text>
                      )}
                      {profile.additionnalPriceCrypto !== null && (
                        <Text fontSize="xs">Crypto: +{profile.additionnalPriceCrypto}€</Text>
                      )}
                      {profile.additionnalPriceHealth !== null && (
                        <Text fontSize="xs">Santé: +{profile.additionnalPriceHealth}€</Text>
                      )}
                      {profile.additionnalPriceCBD !== null && (
                        <Text fontSize="xs">CBD: +{profile.additionnalPriceCBD}€</Text>
                      )}
                      {profile.additionnalPriceSex !== null && (
                        <Text fontSize="xs">Sexe: +{profile.additionnalPriceSex}€</Text>
                      )}
                      {profile.additionnalPriceFinance !== null && (
                        <Text fontSize="xs">Finance: +{profile.additionnalPriceFinance}€</Text>
                      )}
                      {profile.additionnalPriceCasino !== null && (
                        <Text fontSize="xs">Casino: +{profile.additionnalPriceCasino}€</Text>
                      )}
                      {profile.additionalPriceSponso !== null && (
                        <Text fontSize="xs">Sponsorisé: +{profile.additionalPriceSponso}€</Text>
                      )}
                      {profile.additionalPriceDofollow !== null && (
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
        <Button onClick={onOpen} colorScheme="blue" variant="outline">
          Créer un nouveau profil
        </Button>

        <ContinueButton
          onContinue={handleContinue}
          title="Continuer avec ce profil"
          backTitle={translations.selectHeaderStep.backButtonTitle}
          isLoading={isLoading}
          disabled={!selectedProfile}
        />
      </Flex>

      {/* Create Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau profil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Général</Tab>
                <Tab>Prix</Tab>
                <Tab>Contenu</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Nom du profil</FormLabel>
                      <Input
                        value={newProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Mon profile SEO"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Durée de validité</FormLabel>
                      <Select
                        value={newProfile.validityDuration}
                        onChange={(e) => handleInputChange('validityDuration', e.target.value as Profile['validityDuration'])}
                      >
                        <option value="FOREVER">Pour toujours</option>
                        <option value="SIX_MONTHS">6 mois</option>
                        <option value="TWELVE_MONTHS">12 mois</option>
                        <option value="TWENTY_FOUR_MONTHS">24 mois</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Thèmes</FormLabel>
                      <Flex mb={2} wrap="wrap">
                        {newProfile.themes.map((theme, index) => (
                          <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="blue" m={1}>
                            <TagLabel>{theme}</TagLabel>
                            <TagCloseButton onClick={() => removeItem('themes', index)} />
                          </Tag>
                        ))}
                      </Flex>
                      <InputGroup>
                        <Input
                          value={tempInput}
                          onChange={(e) => setTempInput(e.target.value)}
                          placeholder="Ajouter un thème"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('themes');
                            }
                          }}
                        />
                        <InputRightAddon>
                          <Button size="sm" onClick={() => addItem('themes')}>+</Button>
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Langues</FormLabel>
                      <Flex mb={2} wrap="wrap">
                        {newProfile.languages.map((lang, index) => (
                          <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="green" m={1}>
                            <TagLabel>{lang}</TagLabel>
                            <TagCloseButton onClick={() => removeItem('languages', index)} />
                          </Tag>
                        ))}
                      </Flex>
                      <InputGroup>
                        <Input
                          value={tempInput}
                          onChange={(e) => setTempInput(e.target.value)}
                          placeholder="Ajouter une langue"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('languages');
                            }
                          }}
                        />
                        <InputRightAddon>
                          <Button size="sm" onClick={() => addItem('languages')}>+</Button>
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Pays cibles</FormLabel>
                      <Flex mb={2} wrap="wrap">
                        {newProfile.targetCountries.map((country, index) => (
                          <Tag size="md" key={index} borderRadius="full" variant="solid" colorScheme="purple" m={1}>
                            <TagLabel>{country}</TagLabel>
                            <TagCloseButton onClick={() => removeItem('targetCountries', index)} />
                          </Tag>
                        ))}
                      </Flex>
                      <InputGroup>
                        <Input
                          value={tempInput}
                          onChange={(e) => setTempInput(e.target.value)}
                          placeholder="Ajouter un pays"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('targetCountries');
                            }
                          }}
                        />
                        <InputRightAddon>
                          <Button size="sm" onClick={() => addItem('targetCountries')}>+</Button>
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>


                    <FormControl>
                      <FormLabel>Catégorie</FormLabel>
                      <Select
                        value={newProfile.category}
                        onChange={(e) => handleInputChange('category', e.target.value as Profile['category'])}
                      >
                        <option value="IMPOSED">Imposée</option>
                        <option value="IMPOSED_CATEGORY">Catégorie imposée</option>
                        <option value="NOT_IMPOSED">Non imposée</option>
                      </Select>
                    </FormControl>

                    {(newProfile.category === "IMPOSED" || newProfile.category === "IMPOSED_CATEGORY") && (
                      <FormControl>
                        <FormLabel>URL de la catégorie</FormLabel>
                        <Input
                          value={newProfile.categoryUrl || ''}
                          onChange={(e) => handleInputChange('categoryUrl', e.target.value)}
                        />
                      </FormControl>
                    )}

                    <Flex justify="space-between">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Catalogue privé</FormLabel>
                        <Switch
                          isChecked={newProfile.isPrivate}
                          onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Présent sur Google News ?</FormLabel>
                        <Switch
                          isChecked={newProfile.isGoogleNews}
                          onChange={(e) => handleInputChange('isGoogleNews', e.target.checked)}
                        />
                      </FormControl>
                    </Flex>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Prix sans rédaction</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.priceWithoutRedaction || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('priceWithoutRedaction', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Prix avec rédaction</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.priceWithRedaction || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('priceWithRedaction', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Prix pour 100 mots supplémentaires</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.pricePer100Words || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('pricePer100Words', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <Divider my={2} />
                    <Heading size="sm" mb={2}>Prix additionnels par niche</Heading>

                    <FormControl>
                      <FormLabel>Crypto</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceCrypto || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceCrypto', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Santé</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceHealth || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceHealth', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>CBD</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceCBD || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceCBD', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Casino</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceCasino || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceCasino', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Finance</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceFinance || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceFinance', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Sexe</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionnalPriceSex || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionnalPriceSex', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Prix additionnel pour sponsored</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionalPriceSponso || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionalPriceSponso', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Prix additionnel pour dofollow</FormLabel>
                      <InputGroup>
                        <NumberInput min={0} value={newProfile.additionalPriceDofollow || ''} width="100%">
                          <NumberInputField
                            onChange={(e) => handleInputChange('additionalPriceDofollow', e.target.value === '' ? null : parseFloat(e.target.value))}
                          />
                        </NumberInput>
                        <InputRightAddon children="€" />
                      </InputGroup>
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Nombre de mots</FormLabel>
                      <NumberInput min={1} value={newProfile.nbWords}>
                        <NumberInputField
                          onChange={(e) => handleInputChange('nbWords', parseInt(e.target.value) || 500)}
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Type de rédaction</FormLabel>
                      <Select
                        value={newProfile.redactionType}
                        onChange={(e) => handleInputChange('redactionType', e.target.value as Profile['redactionType'])}
                      >
                        <option value="HUMAN">Humain</option>
                        <option value="AI">IA</option>
                        <option value="MIXED">Mixte</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Nombre max. de liens client</FormLabel>
                      <NumberInput min={0} value={newProfile.nbMaxLinksClient}>
                        <NumberInputField
                          onChange={(e) => handleInputChange('nbMaxLinksClient', parseInt(e.target.value) || 0)}
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Nombre max. de liens externes</FormLabel>
                      <NumberInput min={0} value={newProfile.nbMaxLinksExternal}>
                        <NumberInputField
                          onChange={(e) => handleInputChange('nbMaxLinksExternal', parseInt(e.target.value) || 0)}
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Type de lien</FormLabel>
                      <Select
                        value={newProfile.linkType}
                        onChange={(e) => handleInputChange('linkType', e.target.value as Profile['linkType'])}
                      >
                        <option value="DO_FOLLOW">Do Follow</option>
                        <option value="NO_FOLLOW">No Follow</option>
                        <option value="BOTH">Les deux</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Mention sponsorisé</FormLabel>
                      <Select
                        value={newProfile.sponso}
                        onChange={(e) => handleInputChange('sponso', e.target.value as Profile['sponso'])}
                      >
                        <option value="SPONSO">Sponsorisé</option>
                        <option value="NO_SPONSO">Non sponsorisé</option>
                        <option value="BOTH">Les deux</option>
                      </Select>
                    </FormControl>

                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={handleCreateProfile}>
              Créer le profil
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalBody>
  );
};