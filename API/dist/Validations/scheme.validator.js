"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
(0, ajv_errors_1.default)(ajv);
const SchemeValidator = (scheme) => {
    const validate = ajv.compile(scheme);
    const validator = (data) => {
        const valid = validate(data);
        if (valid) {
            return {
                isValid: true,
                errors: ''
            };
        }
        return {
            isValid: false,
            errors: validate.errors
        };
    };
    return validator;
};
exports.SchemeValidator = SchemeValidator;
