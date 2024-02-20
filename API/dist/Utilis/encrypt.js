"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparePassword = exports.EncryptPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_handler_config_1 = require("../Configuration/error.handler.config");
const codigosHttp_1 = require("./codigosHttp");
/**
 Función que sirve para encriptar una contraseña
 @param password -Contraseña a editar
 @return contraseña encryptada.
*/
function EncryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
            return encryptedPassword;
        }
        catch (err) {
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, 'Error al encryptar la contraseña', __filename);
        }
    });
}
exports.EncryptPassword = EncryptPassword;
/**
  @param password1 — Data a ser encriptada.
  @param password2 — La data con la cual se va a comparar el password1.
  @return — retorna una promesa con el resultado de la operación o un error
 */
function ComparePassword(password1, password2) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password1, password2);
    });
}
exports.ComparePassword = ComparePassword;
