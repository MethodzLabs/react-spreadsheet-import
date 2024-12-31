import type XLSX from "xlsx-ugnis"
import { Box, Heading, ModalBody, Text, useStyleConfig } from "@chakra-ui/react"
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
  const { translations, fields } = useRsi()


  const handleContinue = useCallback(async () => {
    const data: any = []
    setIsLoading(true)
    await onContinue(data)
    setIsLoading(false)
  }, [onContinue])

  return (
    <ModalBody>
      <Heading sx={styles.heading}>{translations.uploadStep.title}</Heading>
      <ContinueButton
        onContinue={handleContinue}
        title={translations.selectHeaderStep.nextButtonTitle}
        backTitle={translations.selectHeaderStep.backButtonTitle}
        isLoading={isLoading}
      />
    </ModalBody>
  )
}
