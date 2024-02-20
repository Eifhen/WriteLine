"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIsNotEmpty = exports.ifEmpty = exports.isNotEmpty = exports.isEmpty = void 0;
function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return false;
}
exports.isEmpty = isEmpty;
function isNotEmpty(value) {
    if (value === null || value === undefined) {
        return false;
    }
    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length > 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length > 0;
    }
    return true;
}
exports.isNotEmpty = isNotEmpty;
function ifEmpty(value, orValue) {
    if (isNotEmpty(value)) {
        return value;
    }
    return orValue;
}
exports.ifEmpty = ifEmpty;
function objectIsNotEmpty(object) {
    return Object.keys(object).length > 0;
}
exports.objectIsNotEmpty = objectIsNotEmpty;
