import type XLSX from "xlsx-ugnis"
import { Box, Heading, ModalBody, Text, useStyleConfig } from "@chakra-ui/react"
import { useRsi } from "../../hooks/useRsi"

import { useCallback, useState } from "react"

import type { themeOverrides } from "../../theme"
import { ContinueButton } from "../../components/ContinueButton"

type UploadProps = {
  onContinue: (data: any) => Promise<void>
}

export const SelectImportTypeStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const { translations, fields } = useRsi()
  const [selectedImportType, setSelectedImportType] = useState<string | null>(null);


  const handleContinue = useCallback(async () => {
    const data: any = []
    setIsLoading(true)
    await onContinue(data)
    setIsLoading(false)
  }, [onContinue,])

  const importOptions = [
    "Mise à jour globale",
    "Ajout d'offres",
    "Ajout d'options",
    "Mise à jour d'offres",
  ];

  const handleOptionClick = useCallback((option: string) => {
    setSelectedImportType(option);
  }, []);

  return (
    <ModalBody>
      <Heading sx={styles.heading}>{"Type d'import"}</Heading>
      <div
        id="selector"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {importOptions.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionClick(option)}
            style={{
              border: selectedImportType === option ? "2px solid #007ACC" : "1px solid #ccc",
              padding: "1rem",
              textAlign: "center",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {selectedImportType!==null &&       <ContinueButton
        onContinue={handleContinue}
        title={translations.selectHeaderStep.nextButtonTitle}
        backTitle={translations.selectHeaderStep.backButtonTitle}
        isLoading={isLoading}
      />}

    </ModalBody>
  )
}
