import { headerSelectionTableFields, mockRsiValues } from "../../../stories/mockRsiValues"

import { Providers } from "../../../components/Providers"
import { ModalWrapper } from "../../../components/ModalWrapper"
import { defaultTheme } from "../../../ReactSpreadsheetImport"
import { SelectImportTypeStep } from "../SelectImportTypeStep"
export default {
  title: "Select Import Profile Step",
  parameters: {
    layout: "fullscreen",
  },
}

export const Basic = () => (
  <Providers theme={defaultTheme} rsiValues={mockRsiValues}>
    <ModalWrapper isOpen={true} onClose={() => {}}>
      <SelectImportTypeStep onContinue={async () => {}} />
    </ModalWrapper>
  </Providers>
)
