"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codigosHttp_1 = require("../Utilis/codigosHttp");
const error_handler_config_1 = require("./error.handler.config");
/**
  MiddleWare para manejar la validación del API_Key
**/
function ApiKeyManager(config) {
    return (req, res, next) => {
        try {
            const incomingApiKey = req.headers[config.apikeyHeader];
            if (incomingApiKey === config.apikey) {
                // La API_KEY es válida, permite la solicitud
                next();
            }
            else {
                // La API_KEY es inválida, devuelve un error de acceso no autorizado
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Forbidden, `${codigosHttp_1.MensajeHTTP.Forbidden}: API KEY Invalida`, __filename);
            }
        }
        catch (err) {
            next(err);
        }
    };
}
exports.default = ApiKeyManager;
