import type XLSX from "xlsx-ugnis"
import {
  Box,
  Heading,
  Input,
  ModalBody,
  Radio,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useStyleConfig,
} from "@chakra-ui/react"
import { useRsi } from "../../hooks/useRsi"

import { useCallback, useState } from "react"

import type { themeOverrides } from "../../theme"
import { ContinueButton } from "../../components/ContinueButton"

type UploadProps = {
  onContinue: (data: any) => Promise<void>
}

export const SelectEditorStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const { translations, fields, organizations } = useRsi()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedValue, setSelectedValue] = useState<any>(null)

  const handleContinue = async () => {
    setIsLoading(true)
    await onContinue(selectedValue)
    setIsLoading(false)
  }

  const onRowClick = (row: any) => {
    setSelectedValue(row)

  }

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ModalBody>
      <Heading sx={styles.heading}>{"Selectionner une entreprise"}</Heading>
      <Input
        placeholder="Rechercher par nom"
        mt={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
      <Tbody>
        {filteredOrganizations.map((row, index) => (
          <Tr
            key={index}
            onClick={() => onRowClick(row)}
            style={{
              cursor: "pointer",
              background: selectedValue === row ? "lightgrey" : "none",
            }}
          >
            <Td>{row.name}</Td>
            <Td>{row.id}</Td>
          </Tr>
        ))}
      </Tbody>
      </Table>
      {selectedValue!==null &&   <ContinueButton
        onContinue={handleContinue}
        title={translations.selectHeaderStep.nextButtonTitle}
        backTitle={translations.selectHeaderStep.backButtonTitle}
        isLoading={isLoading}
      />}

    </ModalBody>
  )
}
