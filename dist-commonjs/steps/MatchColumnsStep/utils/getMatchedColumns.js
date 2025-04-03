'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lavenstein = require('js-levenshtein');
var findMatch = require('./findMatch.js');
var setColumn = require('./setColumn.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var lavenstein__default = /*#__PURE__*/_interopDefaultLegacy(lavenstein);

const getMatchedColumns = (columns, fields, data, autoMapDistance, savedMapping, autoMapSelectValues) => columns.reduce((arr, column) => {
    const autoMatch = findMatch.findMatch(column.header, fields, autoMapDistance);
    if (autoMatch) {
        const field = fields.find((field) => field.key === autoMatch);
        const duplicateIndex = arr.findIndex((column) => "value" in column && column.value === field.key);
        const duplicate = arr[duplicateIndex];
        if (duplicate && "value" in duplicate) {
            return lavenstein__default["default"](duplicate.value, duplicate.header) < lavenstein__default["default"](autoMatch, column.header)
                ? [
                    ...arr.slice(0, duplicateIndex),
                    setColumn.setColumn(arr[duplicateIndex], savedMapping, field, data, autoMapSelectValues),
                    ...arr.slice(duplicateIndex + 1),
                    setColumn.setColumn(column, savedMapping),
                ]
                : [
                    ...arr.slice(0, duplicateIndex),
                    setColumn.setColumn(arr[duplicateIndex], savedMapping),
                    ...arr.slice(duplicateIndex + 1),
                    setColumn.setColumn(column, savedMapping, field, data, autoMapSelectValues),
                ];
        }
        else {
            return [...arr, setColumn.setColumn(column, savedMapping, field, data, autoMapSelectValues)];
        }
    }
    else {
        return [...arr, column];
    }
}, []);

exports.getMatchedColumns = getMatchedColumns;
