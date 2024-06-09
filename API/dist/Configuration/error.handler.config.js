"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestErrorHandler = exports.ErrorHandler = exports.RequestError = void 0;
const codigosHttp_1 = require("../Utilis/codigosHttp");
const isEmpty_1 = require("../Utilis/isEmpty");
const consoleColor_1 = __importDefault(require("../Utilis/consoleColor"));
const configurations_1 = require("./configurations");
class RequestError extends Error {
    constructor(status, message, path) {
        super(message);
        this.name = 'RequestError';
        this.status = status;
        this.path = path;
    }
}
exports.RequestError = RequestError;
function ErrorHandler(status, msg, path = '') {
    if (typeof msg === "object") {
        msg = JSON.stringify(msg);
    }
    let error_message = (0, isEmpty_1.ifEmpty)(msg, (0, codigosHttp_1.GetHttpErrorMsg)(status));
    return new RequestError(status, error_message, path);
}
exports.ErrorHandler = ErrorHandler;
function RequestErrorHandler(err, req, res, next) {
    let statusCode = 500; // Código de estado por defecto
    let path = '';
    if (err instanceof RequestError && err.status) {
        statusCode = err.status;
        path = err.path;
    }
    (0, consoleColor_1.default)("RequestErrorHandler", {
        statusCode,
        message: err.message,
        path: path,
        stack: err.stack
    });
    return res.status(statusCode).json({
        status: statusCode,
        message: err.message,
        path, // aqui va production no development
        error: process.env.NODE_ENV === configurations_1.EnvironmentStates.PRODUCTION ? 'Error en el servidor' : err.stack // En producción, no mostrar detalles del error al cliente
    });
}
exports.RequestErrorHandler = RequestErrorHandler;
