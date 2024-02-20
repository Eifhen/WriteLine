"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
/**
  @param data -Data a enviar como respuesta
  @param message -Mensaje a enviar en la respuesta
  @param redirect -Link indicado para redireccionar a cualquier otro luegar si es necesario
  @return Response
 */
function ResponseHandler(data, message, redirect) {
    return {
        data,
        message,
        redirect
    };
}
exports.ResponseHandler = ResponseHandler;
