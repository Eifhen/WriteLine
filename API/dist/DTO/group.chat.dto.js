"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGroupChatDTO = exports.IGroupChatDTOSchema = void 0;
const scheme_validator_1 = require("../Validations/scheme.validator");
exports.IGroupChatDTOSchema = {
    type: "object",
    title: "GroupChatDTO",
    description: "Esquema para validar GroupChatDTO",
    properties: {
        idGroup: {
            type: "string",
        },
        name: {
            type: "string",
            errorMessage: {
                required: "Este campo es requerido"
            }
        },
        idUsers: {
            type: "array",
            errorMessage: {
                required: "Este campo es requerido"
            }
        }
    },
    additionalProperties: false,
    required: ["name", "idUsers"],
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
exports.validateGroupChatDTO = (0, scheme_validator_1.SchemeValidator)(exports.IGroupChatDTOSchema);
