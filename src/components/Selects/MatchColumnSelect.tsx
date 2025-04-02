import { Select } from "chakra-react-select"
import type { SelectOption } from "../../types"
import { customComponents } from "./MenuPortal"
import { useStyleConfig } from "@chakra-ui/react"
import type { Styles } from "../../steps/MatchColumnsStep/components/ColumnGrid"
interface Props {
  onChange: (value: SelectOption | null) => void
  value?: SelectOption
  options: readonly SelectOption[]
  placeholder?: string
  name?: string
}

export const MatchColumnSelect = ({ onChange, value, options, placeholder, name }: Props) => {
  const styles = useStyleConfig("MatchColumnsStep") as Styles
  return (
    <Select<SelectOption, false>
      value={value || null}
      colorScheme="gray"
      useBasicStyles
      onChange={onChange}
      placeholder={placeholder}
      options={options}

      menuPosition="fixed"
      components={customComponents}
      chakraStyles={{
        ...styles.select,
        menu: (provided) => ({
          ...provided,
          width: "auto", // Allow natural content width
          minWidth: "300px", // Set a minimum width for the dropdown
          maxWidth: "600px", // Optional: prevent overly wide menus
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: "300px", // Optional: scroll behavior
          overflowY: "auto",
        }),
      }}
      aria-label={name}
    />
  )
}
