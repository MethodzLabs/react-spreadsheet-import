import { useCallback, useEffect, useMemo, useState } from "react"
import { useToast } from "@chakra-ui/react"
import { UserTableColumn } from "./components/UserTableColumn"
import { useRsi } from "../../hooks/useRsi"
import { TemplateColumn } from "./components/TemplateColumn"
import { ColumnGrid } from "./components/ColumnGrid"
import { setColumn } from "./utils/setColumn"
import { setIgnoreColumn } from "./utils/setIgnoreColumn"
import { setSubColumn } from "./utils/setSubColumn"
import { normalizeTableData } from "./utils/normalizeTableData"
import type { Field, RawData } from "../../types"
import { getMatchedColumns } from "./utils/getMatchedColumns"
import { UnmatchedFieldsAlert } from "../../components/Alerts/UnmatchedFieldsAlert"
import { findUnmatchedRequiredFields } from "./utils/findUnmatchedRequiredFields"
import { Profile } from "../SelectEditorProfileStep/SelectEditorProfileStep"
import axios from "axios"

export type MatchColumnsProps<T extends string> = {
  data: RawData[]
  headerValues: RawData
  onContinue: (data: any[], rawData: RawData[], columns: Columns<T>) => void
  onBack?: () => void
  profile: Profile
}

export enum ColumnType {
  empty,
  ignored,
  matched,
  matchedCheckbox,
  matchedSelect,
  matchedSelectOptions,
}

export type MatchedOptions<T> = {
  entry: string
  value: T
}

type EmptyColumn = { type: ColumnType.empty; index: number; header: string }
type IgnoredColumn = { type: ColumnType.ignored; index: number; header: string }
type MatchedColumn<T> = { type: ColumnType.matched; index: number; header: string; value: T }
type MatchedSwitchColumn<T> = { type: ColumnType.matchedCheckbox; index: number; header: string; value: T }
export type MatchedSelectColumn<T> = {
  type: ColumnType.matchedSelect
  index: number
  header: string
  value: T
  matchedOptions: Partial<MatchedOptions<T>>[]
}
export type MatchedSelectOptionsColumn<T> = {
  type: ColumnType.matchedSelectOptions
  index: number
  header: string
  value: T
  matchedOptions: MatchedOptions<T>[]
}

export type Column<T extends string> =
  | EmptyColumn
  | IgnoredColumn
  | MatchedColumn<T>
  | MatchedSwitchColumn<T>
  | MatchedSelectColumn<T>
  | MatchedSelectOptionsColumn<T>

export type Columns<T extends string> = Column<T>[]

export const MatchColumnsStep = <T extends string>({
  data,
  headerValues,
  onContinue,
  onBack,
  profile,
}: MatchColumnsProps<T>) => {
  const toast = useToast()
  const dataExample = data.slice(0, 2)
  const {
    fields,
    autoMapHeaders,
    autoMapSelectValues,
    autoMapDistance,
    translations,
    savedMapping,
    saveMapping,
    saveSavedAlternateFields,
  } = useRsi<T>()
  const [isLoading, setIsLoading] = useState(false)
  const [columns, setColumns] = useState<Columns<T>>(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    ([...headerValues] as string[]).map((value, index) => ({ type: ColumnType.empty, index, header: value ?? "" })),
  )
  const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] = useState(false)

  const onChange = useCallback(
    (value: T, columnIndex: number) => {
      saveSavedAlternateFields(value, headerValues[columnIndex]?.toString() as string)
      const field = fields.find((field) => field.key === value) as unknown as Field<T>
      const existingFieldIndex = columns.findIndex((column) => "value" in column && column.value === field.key)
      setColumns(
        columns.map<Column<T>>((column, index) => {
          columnIndex === index ? setColumn(column, savedMapping, field, data) : column
          if (columnIndex === index) {
            return setColumn(column, savedMapping, field, data, autoMapSelectValues)
          } else if (index === existingFieldIndex) {
            toast({
              status: "warning",
              variant: "left-accent",
              position: "bottom-left",
              title: translations.matchColumnsStep.duplicateColumnWarningTitle,
              description: translations.matchColumnsStep.duplicateColumnWarningDescription,
              isClosable: true,
            })
            return setColumn(column, savedMapping)
          } else {
            return column
          }
        }),
      )
    },
    [
      autoMapSelectValues,
      columns,
      data,
      fields,
      toast,
      translations.matchColumnsStep.duplicateColumnWarningDescription,
      translations.matchColumnsStep.duplicateColumnWarningTitle,
    ],
  )

  const onIgnore = useCallback(
    (columnIndex: number) => {
      setColumns(columns.map((column, index) => (columnIndex === index ? setIgnoreColumn<T>(column) : column)))
    },
    [columns, setColumns],
  )

  const onRevertIgnore = useCallback(
    (columnIndex: number) => {
      setColumns(columns.map((column, index) => (columnIndex === index ? setColumn(column, savedMapping) : column)))
    },
    [columns, setColumns],
  )

  const onSubChange = useCallback(
    (value: string, columnIndex: number, entry: string) => {
      const column = columns[columnIndex] as MatchedSelectOptionsColumn<T>
      saveMapping(column.value, entry, value)
      setColumns(
        columns.map((column, index) =>
          columnIndex === index && "matchedOptions" in column ? setSubColumn(column, entry, value) : column,
        ),
      )
    },
    [columns, setColumns],
  )
  const unmatchedRequiredFields = useMemo(() => findUnmatchedRequiredFields(fields, columns), [fields, columns])

  const handleOnContinue = useCallback(async () => {
    if (unmatchedRequiredFields.length > 0) {
      setShowUnmatchedFieldsAlert(true)
    } else {
      setIsLoading(true)
      await onContinue(normalizeTableData(columns, data, fields, profile), data, columns)
      setIsLoading(false)
    }
  }, [unmatchedRequiredFields.length, onContinue, columns, data, fields])

  const handleAlertOnContinue = useCallback(async () => {
    setShowUnmatchedFieldsAlert(false)
    setIsLoading(true)
    await onContinue(normalizeTableData(columns, data, fields, profile), data, columns)
    setIsLoading(false)
  }, [onContinue, columns, data, fields])

  useEffect(
    () => {
      if (autoMapHeaders) {
        setColumns(getMatchedColumns(columns, fields, data, autoMapDistance, savedMapping, autoMapSelectValues))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <>
      <UnmatchedFieldsAlert
        profile={profile}
        isOpen={showUnmatchedFieldsAlert}
        onClose={() => setShowUnmatchedFieldsAlert(false)}
        fields={unmatchedRequiredFields.map((elm) => elm.label)}
        onConfirm={handleAlertOnContinue}
        columns={columns}
      />

      <ColumnGrid
        columns={columns}
        onContinue={handleOnContinue}
        onBack={onBack}
        isLoading={isLoading}
        toMatch={unmatchedRequiredFields}
        profile={profile}
        userColumn={(column) => (
          <UserTableColumn
            column={column}
            onIgnore={onIgnore}
            onRevertIgnore={onRevertIgnore}
            entries={dataExample.map((row) => row[column.index])}
          />
        )}
        templateColumn={(column) => <TemplateColumn column={column} onChange={onChange} onSubChange={onSubChange} />}
      />
    </>
  )
}
