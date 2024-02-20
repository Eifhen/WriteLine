"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUserDTOWithPassword = exports.ToUserDTO = exports.validateUserDTO = exports.IUserDTOScheme = void 0;
const name_and_lastname_pattern_1 = require("../Patterns/name_and_lastname.pattern");
const scheme_validator_1 = require("../Validations/scheme.validator");
/******************************************
 Schema AJV para el DTO IUserDTO
******************************************/
exports.IUserDTOScheme = {
    title: "IUserDTO Scheme",
    type: "object",
    description: "Esquema para el objeto IUserDTO",
    properties: {
        _id: {
            type: "string"
        },
        guid: {
            type: "string"
        },
        nombre: {
            type: "string",
            pattern: name_and_lastname_pattern_1.NAME_AND_LASTNAME_PATTERN_STR,
            errorMessage: {
                pattern: "El nombre debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
            }
        },
        apellido: {
            type: "string",
            pattern: name_and_lastname_pattern_1.NAME_AND_LASTNAME_PATTERN_STR,
            errorMessage: {
                pattern: "El apellido debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
            }
        },
        email: {
            type: "string",
            format: "email",
            errorMessage: {
                format: "El formato del email no es valido."
            }
        },
        password: {
            type: "string",
        },
        image: {
            type: "object"
        },
        date: {
            type: "string",
            format: "date-time"
        }
    },
    required: ["nombre", "apellido", "email"],
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
/**********************************************
  Funsión que valida que un objeto cumpla con
  el Schema de la interfaz
**********************************************/
exports.validateUserDTO = (0, scheme_validator_1.SchemeValidator)(exports.IUserDTOScheme);
const ToUserDTO = (user) => {
    return {
        _id: user._id,
        guid: user.guid,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        image: user.image,
        date: user.createdAt
    };
};
exports.ToUserDTO = ToUserDTO;
const ToUserDTOWithPassword = (user) => {
    return {
        _id: user._id,
        guid: user.guid,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: user.password,
        image: user.image,
        date: user.createdAt
    };
};
exports.ToUserDTOWithPassword = ToUserDTOWithPassword;
