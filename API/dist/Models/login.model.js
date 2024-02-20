"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginModel = exports.ILoginModelScheme = void 0;
const password_pattern_1 = require("../Patterns/password.pattern");
const scheme_validator_1 = require("../Validations/scheme.validator");
/**
  Esquema para la interfaz de inicio de sesión
**/
exports.ILoginModelScheme = {
    title: "Login Scheme",
    description: "Esquema para el objeto de Login",
    type: 'object',
    properties: {
        email: {
            description: "Hace referencia al email del usuario",
            type: "string",
            format: "email",
            errorMessage: {
                type: "El email debe ser de tipo string",
                format: "El campo 'email' debe ser una dirección de correo electrónico válida",
            }
        },
        password: {
            description: "Hace referencia al password del usuario",
            type: "string",
            pattern: password_pattern_1.PASSWORD_PATTERN_STR,
            errorMessage: {
                type: "La contraseña debe ser de tipo string",
                pattern: "La contraseña debe ser de 5-20 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)",
            }
        }
    },
    required: ["email", "password"],
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
/**
  Funsión que valida el esquema de la interfaz de inicio de sesión
**/
exports.validateLoginModel = (0, scheme_validator_1.SchemeValidator)(exports.ILoginModelScheme);
