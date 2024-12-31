import { headerSelectionTableFields, mockRsiValues } from "../../../stories/mockRsiValues"

import { Providers } from "../../../components/Providers"
import { ModalWrapper } from "../../../components/ModalWrapper"
import { defaultTheme } from "../../../ReactSpreadsheetImport"
import { SelectEditorProfileStep } from "../SelectEditorProfileStep"
export default {
  title: "Select Editor Profile Step",
  parameters: {
    layout: "fullscreen",
  },
}

export const Basic = () => (
  <Providers theme={defaultTheme} rsiValues={mockRsiValues}>
    <ModalWrapper isOpen={true} onClose={() => {}}>
      <SelectEditorProfileStep onContinue={async () => {}} />
    </ModalWrapper>
  </Providers>
)
