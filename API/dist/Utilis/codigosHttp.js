"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHttpErrorMsg = exports.MensajeHTTP = exports.CodigoHTTP = void 0;
var CodigoHTTP;
(function (CodigoHTTP) {
    // Información
    CodigoHTTP[CodigoHTTP["OK"] = 200] = "OK";
    CodigoHTTP[CodigoHTTP["Created"] = 201] = "Created";
    CodigoHTTP[CodigoHTTP["Accepted"] = 202] = "Accepted";
    CodigoHTTP[CodigoHTTP["Deleted"] = 204] = "Deleted";
    CodigoHTTP[CodigoHTTP["Updated"] = 200] = "Updated";
    // Errores de cliente
    CodigoHTTP[CodigoHTTP["BadRequest"] = 400] = "BadRequest";
    CodigoHTTP[CodigoHTTP["Unauthorized"] = 401] = "Unauthorized";
    CodigoHTTP[CodigoHTTP["Forbidden"] = 403] = "Forbidden";
    CodigoHTTP[CodigoHTTP["NotFound"] = 404] = "NotFound";
    CodigoHTTP[CodigoHTTP["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    CodigoHTTP[CodigoHTTP["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    // Errores de servidor
    CodigoHTTP[CodigoHTTP["InternalServerError"] = 500] = "InternalServerError";
    CodigoHTTP[CodigoHTTP["NotImplemented"] = 501] = "NotImplemented";
    CodigoHTTP[CodigoHTTP["BadGateway"] = 502] = "BadGateway";
    CodigoHTTP[CodigoHTTP["ServiceUnavailable"] = 503] = "ServiceUnavailable";
})(CodigoHTTP || (exports.CodigoHTTP = CodigoHTTP = {}));
var MensajeHTTP;
(function (MensajeHTTP) {
    // Información
    MensajeHTTP["OK"] = "Petici\u00F3n exitosa";
    MensajeHTTP["Created"] = "Recurso creado exitosamente";
    MensajeHTTP["Accepted"] = "Petici\u00F3n aceptada";
    MensajeHTTP["Updated"] = "Recurso actualizado exitosamente";
    MensajeHTTP["Deleted"] = "Recurso eliminado exitosamente";
    // Errores de cliente
    MensajeHTTP["BadRequest"] = "Solicitud incorrecta";
    MensajeHTTP["Unauthorized"] = "No autorizado";
    MensajeHTTP["Forbidden"] = "Acceso prohibido";
    MensajeHTTP["NotFound"] = "Recurso no encontrado";
    MensajeHTTP["MethodNotAllowed"] = "M\u00E9todo no permitido";
    MensajeHTTP["UnprocessableEntity"] = "Entidad no procesable";
    // Errores de servidor
    MensajeHTTP["InternalServerError"] = "Error interno del servidor";
    MensajeHTTP["NotImplemented"] = "Funcionalidad no implementada";
    MensajeHTTP["BadGateway"] = "Puerta de enlace incorrecta";
    MensajeHTTP["ServiceUnavailable"] = "Servicio no disponible";
})(MensajeHTTP || (exports.MensajeHTTP = MensajeHTTP = {}));
function GetHttpErrorMsg(codigo) {
    switch (codigo) {
        case CodigoHTTP.BadRequest:
            return MensajeHTTP.BadRequest;
        case CodigoHTTP.Unauthorized:
            return MensajeHTTP.Unauthorized;
        case CodigoHTTP.Forbidden:
            return MensajeHTTP.Forbidden;
        case CodigoHTTP.NotFound:
            return MensajeHTTP.NotFound;
        case CodigoHTTP.MethodNotAllowed:
            return MensajeHTTP.MethodNotAllowed;
        case CodigoHTTP.UnprocessableEntity:
            return MensajeHTTP.UnprocessableEntity;
        case CodigoHTTP.InternalServerError:
            return MensajeHTTP.InternalServerError;
        case CodigoHTTP.NotImplemented:
            return MensajeHTTP.NotImplemented;
        case CodigoHTTP.BadGateway:
            return MensajeHTTP.BadGateway;
        case CodigoHTTP.ServiceUnavailable:
            return MensajeHTTP.ServiceUnavailable;
        default:
            return 'Ha ocurrido un error.';
    }
}
exports.GetHttpErrorMsg = GetHttpErrorMsg;
