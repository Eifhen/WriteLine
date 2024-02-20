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
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../Utilis/token");
const error_handler_config_1 = require("./error.handler.config");
const user_model_1 = require("../Models/user.model");
const codigosHttp_1 = require("../Utilis/codigosHttp");
/*
  Este método debe validar que el token recibido sea valido
  y debe validar que el usuario recibido exista, de lo contrario
  el acceso a la API debe ser denegado.
*/
function AutenticationManager(config) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (token) {
                const decode = (0, token_1.DecodeJWToken)(token);
                if (decode) {
                    // validar que el usuario exista;
                    const guid = decode.data.guid;
                    const currentUser = yield user_model_1.UserModel.findOne({ guid });
                    if (currentUser) {
                        req.currentUser = currentUser;
                        req.decodedToken = decode;
                        return next();
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Unauthorized, "Usuario Invalido", __filename);
                }
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Unauthorized, `Sin Token: ${token}`, __filename);
        }
        catch (err) {
            //throw ErrorHandler(err.status, err.message, err.path);
            next(err);
        }
    });
}
exports.default = AutenticationManager;
