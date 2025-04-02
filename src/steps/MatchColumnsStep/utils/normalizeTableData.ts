import type { Columns } from "../MatchColumnsStep"
import { ColumnType } from "../MatchColumnsStep"
import type { Data, Fields, RawData } from "../../../types"
import { normalizeCheckboxValue } from "./normalizeCheckboxValue"
import { Profile } from "../../SelectEditorProfileStep/SelectEditorProfileStep"



export const normalizeTableData = <T extends string>(
  columns: Columns<T>,
  data: RawData[],
  fields: Fields<T>,
  profile: Profile
) => {

  return data.map((row) => {
    const result = columns.reduce((acc, column, index) => {
      const curr = row[index];
      switch (column.type) {
        case ColumnType.matchedCheckbox: {
          const field = fields.find((field) => field.key === column.value)!;
          if ("booleanMatches" in field.fieldType && Object.keys(field.fieldType).length) {
            const booleanMatchKey = Object.keys(field.fieldType.booleanMatches || []).find(
              (key) => key.toLowerCase() === curr?.toLowerCase(),
            )!;
            const booleanMatch = field.fieldType.booleanMatches?.[booleanMatchKey];
            acc[column.value] = booleanMatchKey ? booleanMatch : normalizeCheckboxValue(curr);
          } else {
            acc[column.value] = normalizeCheckboxValue(curr);
          }
          break;
        }
        case ColumnType.matched: {
          acc[column.value] = curr === "" ? undefined : curr;
          break;
        }
        case ColumnType.matchedSelect:
        case ColumnType.matchedSelectOptions: {
          const matchedOption = column.matchedOptions.find(({ entry }) => entry === curr);
          acc[column.value] = matchedOption?.value || undefined;
          break;
        }
        case ColumnType.empty:
        case ColumnType.ignored:
        default:
          break;
      }
      return acc;
    }, {} as Data<T>);

    // Merge with defaultProfile to add missing keys
    return {
      ...profile,
      ...result, // values in result override defaultProfile if they exist
    };
  });
};
