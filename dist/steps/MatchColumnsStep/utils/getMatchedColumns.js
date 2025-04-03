import lavenstein from 'js-levenshtein';
import { findMatch } from './findMatch.js';
import { setColumn } from './setColumn.js';

const getMatchedColumns = (columns, fields, data, autoMapDistance, savedMapping, autoMapSelectValues) => columns.reduce((arr, column) => {
    const autoMatch = findMatch(column.header, fields, autoMapDistance);
    if (autoMatch) {
        const field = fields.find((field) => field.key === autoMatch);
        const duplicateIndex = arr.findIndex((column) => "value" in column && column.value === field.key);
        const duplicate = arr[duplicateIndex];
        if (duplicate && "value" in duplicate) {
            return lavenstein(duplicate.value, duplicate.header) < lavenstein(autoMatch, column.header)
                ? [
                    ...arr.slice(0, duplicateIndex),
                    setColumn(arr[duplicateIndex], savedMapping, field, data, autoMapSelectValues),
                    ...arr.slice(duplicateIndex + 1),
                    setColumn(column, savedMapping),
                ]
                : [
                    ...arr.slice(0, duplicateIndex),
                    setColumn(arr[duplicateIndex], savedMapping),
                    ...arr.slice(duplicateIndex + 1),
                    setColumn(column, savedMapping, field, data, autoMapSelectValues),
                ];
        }
        else {
            return [...arr, setColumn(column, savedMapping, field, data, autoMapSelectValues)];
        }
    }
    else {
        return [...arr, column];
    }
}, []);

export { getMatchedColumns };
