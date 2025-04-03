'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MatchColumnsStep = require('../MatchColumnsStep.js');
var uniqueEntries = require('./uniqueEntries.js');

function toUpperSnakeCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
}
const setColumn = (oldColumn, savedMapping, field, data, autoMapSelectValues) => {
    switch (field?.fieldType.type) {
        case "select":
            const fieldOptions = field.fieldType.options;
            console.log(field);
            const uniqueData = uniqueEntries.uniqueEntries(data || [], oldColumn.index);
            const matchedOptions = autoMapSelectValues
                ? uniqueData.map((record) => {
                    let value = fieldOptions.find((fieldOption) => fieldOption.value === record.entry || fieldOption.label === record.entry)?.value;
                    if (!value) {
                        const fieldKey = toUpperSnakeCase(field?.key);
                        if (savedMapping && savedMapping[fieldKey] && savedMapping[fieldKey].map[record.entry]) {
                            value = savedMapping[fieldKey].map[record.entry];
                        }
                    }
                    return value ? { ...record, value } : record;
                })
                : uniqueData;
            const allMatched = matchedOptions.filter((o) => o.value).length == uniqueData?.length;
            console.log(allMatched);
            return {
                ...oldColumn,
                type: allMatched ? MatchColumnsStep.ColumnType.matchedSelectOptions : MatchColumnsStep.ColumnType.matchedSelect,
                value: field.key,
                matchedOptions,
            };
        case "checkbox":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matchedCheckbox, value: field.key, header: oldColumn.header };
        case "input":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matched, value: field.key, header: oldColumn.header };
        default:
            return { index: oldColumn.index, header: oldColumn.header, type: MatchColumnsStep.ColumnType.empty };
    }
};

exports.setColumn = setColumn;
