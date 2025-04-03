import React from "react"
import type { Column, Columns } from "../MatchColumnsStep"
import { Box, Button, Flex, Heading, ModalBody, ModalFooter, Text, Tooltip, useStyleConfig } from "@chakra-ui/react"
import { FadingWrapper } from "../../../components/FadingWrapper"
import { ContinueButton } from "../../../components/ContinueButton"
import { useRsi } from "../../../hooks/useRsi"
import type { themeOverrides } from "../../../theme"
import { Profile } from "../../SelectEditorProfileStep/SelectEditorProfileStep"

type ColumnGridProps<T extends string> = {
  columns: Columns<T>
  userColumn: (column: Column<T>) => React.ReactNode
  templateColumn: (column: Column<T>) => React.ReactNode
  onContinue: (val: Record<string, string>[]) => void
  onBack?: () => void
  isLoading: boolean
  toMatch: any
  profile: Profile
}
type FieldStatusRowProps = {
  profile: Record<string, any>
}
const keyToLabelMap: any = {
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
}

export type Styles = (typeof themeOverrides)["components"]["MatchColumnsStep"]["baseStyle"]
export const ColumnGrid = <T extends string>({
  columns,
  userColumn,
  templateColumn,
  onContinue,
  onBack,
  isLoading,
  toMatch,
  profile,
}: ColumnGridProps<T>) => {
  const { translations } = useRsi()

  const styles = useStyleConfig("MatchColumnsStep") as Styles
  const styles2 = useStyleConfig("Modal") as (typeof themeOverrides)["components"]["Modal"]["baseStyle"]
  const toMatchKeys = new Set(toMatch.map((item: any) => item.key))
  const renderProfileItems = () => {
    // Keep track of fields that are null and in toMatch
    const nullMatchFields = [] as any[]
    console.log(columns)
    const items = Object.entries(profile)
      .map(([key, value]) => {
        if (
          key == "name" ||
          key == "organizationId" ||
          key == "id" ||
          key.startsWith("price") ||
          key.startsWith("additionnal") ||
          key.startsWith("additional")
        )
          return
        const isInToMatch = toMatchKeys.has(key)

        let bg = "gray.200"
        let tag = ""
        let tooltip = ""
        if (!isInToMatch) {
          bg = "green.400"
          tag = "C"
          tooltip = 'Utilise la valeur de la colonne "' + columns.find((elm: any) => elm?.value == key)?.header + ' "'
        } else if (value !== null && isInToMatch) {
          bg = "green.400"
          tag = "P"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          tooltip = "Utilise la valeur du profile " + profile[key]
        } else if (value == null && isInToMatch) {
          tag = "M"
          bg = "red.400"
          tooltip = "Mapping manquant"
          // Add this field to our nullMatchFields array
          nullMatchFields.push(key)
        }

        return (
          <Flex key={key} width={"300px"}>
            <p
              style={{
                fontSize: "12px",
                width: "190px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {keyToLabelMap[key]}
            </p>
            <Tooltip key={key} label={tooltip} hasArrow>
              <Flex
                direction="column"
                align="center"
                justify="center"
                w="60px"
                h="60px"
                bg={bg}
                borderRadius="md"
                boxShadow="sm"
                fontSize="md"
                fontWeight="bold"
                color="white"
                p={1}
              >
                <Text>{tag}</Text>
              </Flex>
            </Tooltip>
          </Flex>
        )
      })
      .filter(Boolean)
    // Filter out null items

    return { items, nullMatchFields }
  }

  // Now use the function in your component
  const { items, nullMatchFields } = renderProfileItems()
  return (
    <>
      <ModalBody flexDir="column" p={8} overflow="auto">
        <Heading sx={styles.heading}>{translations.matchColumnsStep.title}</Heading>
        <Flex
          flex={1}
          display="grid"
          gridTemplateRows="auto auto auto 1fr"
          gridTemplateColumns={`0.75rem repeat(${columns.length}, minmax(18rem, auto)) 0.75rem`}
        >
          <Box gridColumn={`1/${columns.length + 3}`}>
            <Text sx={styles.title}>{translations.matchColumnsStep.userTableTitle}</Text>
          </Box>
          {columns.map((column, index) => (
            <Box gridRow="2/3" gridColumn={`${index + 2}/${index + 3}`} pt={3} key={column.header + index}>
              {userColumn(column)}
            </Box>
          ))}
          <FadingWrapper gridColumn={`1/${columns.length + 3}`} gridRow="2/3" />
          <Box gridColumn={`1/${columns.length + 3}`} mt={7}>
            <Text sx={styles.title}>{translations.matchColumnsStep.templateTitle}</Text>
          </Box>
          <FadingWrapper gridColumn={`1/${columns.length + 3}`} gridRow="4/5" />
          {columns.map((column, index) => (
            <Box
              gridRow="4/5"
              gridColumn={`${index + 2}/${index + 3}`}
              key={column.header + index}
              py="1.125rem"
              pl={2}
              pr={3}
            >
              {templateColumn(column)}
            </Box>
          ))}
        </Flex>
      </ModalBody>

      {columns.some(
        (column) =>
          "matchedOptions" in column &&
          Array.isArray(column.matchedOptions) &&
          column.matchedOptions.some((option) => !option.value),
      ) || nullMatchFields.length > 0 ? (
        <>
          <ModalFooter>
            <Button size="md" sx={styles2.backButton} onClick={onBack} isLoading={isLoading} variant="link">
              retour
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <UnmatchedColumnsButton columns={columns} />
              <NullFieldsButton fields={items} nullsItems={nullMatchFields}></NullFieldsButton>
            </div>
            <div></div>
          </ModalFooter>
        </>
      ) : (
        <ContinueButton
          isLoading={isLoading}
          onContinue={onContinue}
          onBack={onBack}
          title={translations.matchColumnsStep.nextButtonTitle}
          backTitle={translations.matchColumnsStep.backButtonTitle}
        />
      )}
    </>
  )
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const UnmatchedColumnsButton = ({ columns }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const unmatchedColumnsData = columns
    .filter(
      (column: any) =>
        "matchedOptions" in column &&
        Array.isArray(column.matchedOptions) &&
        column.matchedOptions.some((option: any) => !option.value),
    )
    .map(
      (column: any) =>
        "matchedOptions" in column && {
          name: column.header,
          value: column.value,
          unmatchedCount: column.matchedOptions.filter((option: any) => !option.value).length,
        },
    )
    .filter(Boolean) // Filter out any undefined results

  const totalUnmatchedColumns = unmatchedColumnsData.length

  if (totalUnmatchedColumns === 0) return null

  return (
    <>
      <Flex justifyContent="center" mt={2} mb={4}>
        <Box
          as="button"
          bg="yellow.400"
          color="black"
          px={4}
          py={2}
          borderRadius="md"
          fontWeight="medium"
          _hover={{ bg: "yellow.500" }}
          onClick={() => setIsOpen(true)}
        >
          Il reste {totalUnmatchedColumns} colonnes avec des valeurs à mapper
        </Box>
      </Flex>

      {isOpen && (
        <>
          {/* Modal backdrop */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={1000}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            p={5}
            zIndex={1001}
            width="auto"
            minWidth="350px"
            maxWidth="90vw"
            maxHeight="90vh"
            overflow="auto"
          >
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="sm">Détails des colonnes à mapper</Heading>
              <Box as="button" p={2} borderRadius="md" _hover={{ bg: "gray.100" }} onClick={() => setIsOpen(false)}>
                ✕
              </Box>
            </Flex>

            <Box as="table" width="100%">
              <Box as="thead">
                <Box as="tr">
                  <Box as="th" textAlign="left" p={2}>
                    Colonne
                  </Box>
                  <Box as="th" textAlign="right" p={2}>
                    Valeurs non mappées
                  </Box>
                </Box>
              </Box>
              <Box as="tbody">
                {unmatchedColumnsData.map((column: any, index: any) => (
                  <Box as="tr" key={index} borderTopWidth="1px" borderColor="gray.200">
                    <Box as="td" p={2}>
                      {column.name} -{">"} {keyToLabelMap[column.value]}
                    </Box>
                    <Box as="td" textAlign="right" p={2}>
                      {column.unmatchedCount}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

// Replace your existing Object.entries code with the items render
// Add this new component for the null fields button and modal
const NullFieldsButton = ({ fields, nullsItems }: { fields: any; nullsItems: any }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return nullsItems.length > 0 ? (
    <>
      <Flex justifyContent="center" mt={3} mb={3}>
        <Box
          as="button"
          bg="yellow.400"
          color="white"
          px={4}
          py={2}
          borderRadius="md"
          fontWeight="medium"
          _hover={{ bg: "red.500" }}
          onClick={() => setIsOpen(true)}
        >
          Il reste {nullsItems.length} champs à valeur null
        </Box>
      </Flex>

      {isOpen && (
        <>
          {/* Modal backdrop */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={1000}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            p={5}
            zIndex={1001}
            width="auto"
            minWidth="350px"
            maxWidth="90vw"
            maxHeight="90vh"
            overflow="auto"
          >
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="sm">Champs avec valeurs null</Heading>
              <Box as="button" p={2} borderRadius="md" _hover={{ bg: "gray.100" }} onClick={() => setIsOpen(false)}>
                ✕
              </Box>
            </Flex>

            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" width="100%">
              {fields.map((field: any, index: number) => (
                <Box key={index} p={2}>
                  {field}
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </>
  ) : (
    <></>
  )
}
