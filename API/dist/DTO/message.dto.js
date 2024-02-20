"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessageDTO = exports.IMessageDTOSchema = void 0;
const scheme_validator_1 = require("../Validations/scheme.validator");
exports.IMessageDTOSchema = {
    type: "object",
    title: "MessageDTO",
    description: "Esquema para validar IMessageDTO",
    properties: {
        idChat: {
            type: "string",
            errorMessage: {
                required: "Este campo es requerido"
            }
        },
        message: {
            type: "string",
            errorMessage: {
                required: "Este campo es requerido"
            }
        },
    },
    additionalProperties: false,
    required: ["message", "idChat"],
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
exports.validateMessageDTO = (0, scheme_validator_1.SchemeValidator)(exports.IMessageDTOSchema);
