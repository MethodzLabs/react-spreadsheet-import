import type { Columns } from "../MatchColumnsStep"
import { ColumnType } from "../MatchColumnsStep"
import type { Data, Fields, RawData } from "../../../types"
import { normalizeCheckboxValue } from "./normalizeCheckboxValue"
import { Profile } from "../../ValidationStep/types"

export const normalizeTableData = <T extends string>(
  columns: Columns<T>,
  data: RawData[],
  fields: Fields<T>
) => {
  const defaultProfile: Profile = {
    additionalPriceDofollow: null,
    additionalPriceSponso: null,
    additionnalPriceCBD: null,
    additionnalPriceCasino: null,
    additionnalPriceCrypto: null,
    additionnalPriceFinance: null,
    additionnalPriceHealth: null,
    additionnalPriceSex: null,
    category: "",
    categoryUrl: "",
    isGoogleNews: false,
    isPrivate: false,
    languages: [],
    linkType: "Lien en \"doFollow\"",
    nbMaxLinksClient: 0,
    nbMaxLinksExternal: 0,
    nbWords: 0,
    presentation: "",
    pricePer100Words: 0,
    priceWithRedaction: null,
    priceWithoutRedaction: null,
    redactionType: "no",
    sponso: false,
    targetCountries: [],
    themes: [],
    url: "",
    validityDuration: 0,
  };

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
      ...defaultProfile,
      ...result, // values in result override defaultProfile if they exist
    };
  });
};
