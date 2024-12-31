import { headerSelectionTableFields, mockRsiValues } from "../../../stories/mockRsiValues"

import { Providers } from "../../../components/Providers"
import { ModalWrapper } from "../../../components/ModalWrapper"
import { defaultTheme } from "../../../ReactSpreadsheetImport"
import { SelectEditorStep } from "../SelectEditorStep"
export default {
  title: "Select Editor Step",
  parameters: {
    layout: "fullscreen",
  },
}

export const Basic = () => (
  <Providers theme={defaultTheme} rsiValues={mockRsiValues}>
    <ModalWrapper isOpen={true} onClose={() => {}}>
      <SelectEditorStep  onContinue={async () => {}} />
    </ModalWrapper>
  </Providers>
)
