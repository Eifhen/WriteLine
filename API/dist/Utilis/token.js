"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeJWToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../Configuration/configurations"));
const error_handler_config_1 = require("../Configuration/error.handler.config");
const codigosHttp_1 = require("./codigosHttp");
const config = (0, configurations_1.default)();
const SECRET = config.tk_key;
function GetJWToken(payload) {
    const data = { data: payload };
    //return jwt.sign(data, SECRET, { expiresIn: '1d', algorithm:"HS256" });
    return jsonwebtoken_1.default.sign(data, SECRET, { algorithm: "HS256" });
}
exports.default = GetJWToken;
function DecodeJWToken(token) {
    try {
        const tk = token.split(" ")[1]; // quitamos el Bearer
        const decoded = jsonwebtoken_1.default.verify(tk, SECRET);
        // console.log("Decoded =>", decoded, __filename);
        return decoded;
    }
    catch (error) {
        throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Unauthorized, `Error al decodificar el token: ${error.message}`, __filename);
    }
}
exports.DecodeJWToken = DecodeJWToken;
