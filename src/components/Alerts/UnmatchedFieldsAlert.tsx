import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  Box,
} from "@chakra-ui/react"
import { useRef } from "react"
import { useRsi } from "../../hooks/useRsi"
import { Profile } from "../../steps/SelectEditorProfileStep/SelectEditorProfileStep"

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fields: string[]
  profile: Profile
}

export const UnmatchedFieldsAlert = ({ isOpen, onClose, onConfirm, fields , profile}: Props) => {
  const { allowInvalidSubmit, translations } = useRsi()
  const cancelRef = useRef<HTMLButtonElement | null>(null)



  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered id="rsi">
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {translations.alerts.unmatchedRequiredFields.headerTitle}
          </AlertDialogHeader>
          <AlertDialogBody>
            {translations.alerts.unmatchedRequiredFields.bodyText}

            <Box pt={3}>
              <Text display="inline">{translations.alerts.unmatchedRequiredFields.listTitle}</Text>
              <Text display="inline" fontWeight="bold">
                {" "}
                {fields.join(", ")}
              </Text>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="secondary">
              {translations.alerts.unmatchedRequiredFields.cancelButtonTitle}
            </Button>
            {allowInvalidSubmit && (
              <Button onClick={onConfirm} ml={3}>
                {translations.alerts.unmatchedRequiredFields.continueButtonTitle}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
