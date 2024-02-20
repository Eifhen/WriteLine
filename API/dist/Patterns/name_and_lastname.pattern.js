"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAME_AND_LASTNAME_PATTERN_STR = exports.NAME_AND_LASTNAME_PATTERN = void 0;
/**
  Patrón RegExp que garantiza que el nombre y apellido de usuario
  deban tener entre 3-16 caracteres y no deban poseer números ni ningún caracter especial
**/
exports.NAME_AND_LASTNAME_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$/;
exports.NAME_AND_LASTNAME_PATTERN_STR = "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$";
