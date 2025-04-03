import type { Field } from "../../../types"
import { Column, ColumnType, MatchColumnsProps, MatchedOptions } from "../MatchColumnsStep"
import { uniqueEntries } from "./uniqueEntries"
type KeyValue = {
  [key: string]: string;
}
type savedMapping = {
  [key: string]: KeyValue[]
}
function toUpperSnakeCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()
}

export const setColumn = <T extends string>(
  oldColumn: Column<T>,
  savedMapping: any,
  field?: Field<T>,
  data?: MatchColumnsProps<T>["data"],
  autoMapSelectValues?: boolean,

): Column<T> => {
  switch (field?.fieldType.type) {
    case "select":
      const fieldOptions = field.fieldType.options
      console.log(field)
      const uniqueData = uniqueEntries(data || [], oldColumn.index) as MatchedOptions<T>[]
      const matchedOptions = autoMapSelectValues
        ? uniqueData.map((record) => {
            let value = fieldOptions.find(
              (fieldOption) => fieldOption.value === record.entry || fieldOption.label === record.entry,
            )?.value

            if (!value) {
              const fieldKey = toUpperSnakeCase(field?.key)
              if (savedMapping && savedMapping[fieldKey] && savedMapping[fieldKey].map[record.entry]) {
                value = savedMapping[fieldKey].map[record.entry]
              }
            }
            return value ? ({ ...record, value } as MatchedOptions<T>) : (record as MatchedOptions<T>)
          })
        : uniqueData
      const allMatched = matchedOptions.filter((o) => o.value).length == uniqueData?.length
      console.log(allMatched)
      return {
        ...oldColumn,
        type: allMatched ? ColumnType.matchedSelectOptions : ColumnType.matchedSelect,
        value: field.key,
        matchedOptions,
      }
    case "checkbox":
      return { index: oldColumn.index, type: ColumnType.matchedCheckbox, value: field.key, header: oldColumn.header }
    case "input":
      return { index: oldColumn.index, type: ColumnType.matched, value: field.key, header: oldColumn.header }
    default:
      return { index: oldColumn.index, header: oldColumn.header, type: ColumnType.empty }
  }
}
