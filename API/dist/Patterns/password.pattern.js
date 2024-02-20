"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_PATTERN_STR = exports.PASSWORD_PATTERN = void 0;
/**
  RegExp que valida que la contraseña
  La contraseña debe ser de 5-100 caracteres y
  debe incluir por lo menos 1 letra, 1 número y un caracter especial
**/
exports.PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*$]{5,100}$/;
exports.PASSWORD_PATTERN_STR = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*$]{5,100}$";
