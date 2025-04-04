'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MatchColumnsStep = require('../MatchColumnsStep.js');
var normalizeCheckboxValue = require('./normalizeCheckboxValue.js');

const normalizeTableData = (columns, data, fields, profile) => {
    return data.map((row) => {
        const result = columns.reduce((acc, column, index) => {
            const curr = row[index];
            switch (column.type) {
                case MatchColumnsStep.ColumnType.matchedCheckbox: {
                    const field = fields.find((field) => field.key === column.value);
                    if ("booleanMatches" in field.fieldType && Object.keys(field.fieldType).length) {
                        const booleanMatchKey = Object.keys(field.fieldType.booleanMatches || []).find((key) => key.toLowerCase() === curr?.toLowerCase());
                        const booleanMatch = field.fieldType.booleanMatches?.[booleanMatchKey];
                        acc[column.value] = booleanMatchKey ? booleanMatch : normalizeCheckboxValue.normalizeCheckboxValue(curr);
                    }
                    else {
                        acc[column.value] = normalizeCheckboxValue.normalizeCheckboxValue(curr);
                    }
                    break;
                }
                case MatchColumnsStep.ColumnType.matched: {
                    acc[column.value] = curr === "" ? undefined : curr;
                    break;
                }
                case MatchColumnsStep.ColumnType.matchedSelect:
                case MatchColumnsStep.ColumnType.matchedSelectOptions: {
                    const matchedOption = column.matchedOptions.find(({ entry }) => entry === curr);
                    acc[column.value] = matchedOption?.value || undefined;
                    break;
                }
                case MatchColumnsStep.ColumnType.empty:
                case MatchColumnsStep.ColumnType.ignored:
            }
            return acc;
        }, {});
        const { id, organizationId, name, ...restResult } = profile;
        // Merge with defaultProfile to add missing keys
        return {
            ...restResult,
            ...result, // values in result override defaultProfile if they exist
        };
    });
};

exports.normalizeTableData = normalizeTableData;
