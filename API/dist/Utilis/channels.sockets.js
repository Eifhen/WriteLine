"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_CHANNEL = void 0;
/**
 @description
 Registro de todos los canales de sockets
 que estamos utilizando
*/
var SERVER_CHANNEL;
(function (SERVER_CHANNEL) {
    SERVER_CHANNEL["CreateRoom"] = "create-room";
    SERVER_CHANNEL["JoinChat"] = "join-chat";
    SERVER_CHANNEL["NewMessage"] = "new-message";
    SERVER_CHANNEL["MessageRecieved"] = "message-recieved";
    SERVER_CHANNEL["GroupMessage"] = "group-message";
    SERVER_CHANNEL["UpdateGroup"] = "update-group";
    SERVER_CHANNEL["UpdatedGroup"] = "updated-group";
    SERVER_CHANNEL["Typing"] = "typing";
    SERVER_CHANNEL["StopTyping"] = "stop-typing";
    SERVER_CHANNEL["Connection"] = "connection";
    SERVER_CHANNEL["Connected"] = "connected";
    SERVER_CHANNEL["ConnectionError"] = "connect_error";
    SERVER_CHANNEL["Desconecting"] = "disconnecting";
    SERVER_CHANNEL["Disconnect"] = "disconnect";
    SERVER_CHANNEL["Error"] = "error";
})(SERVER_CHANNEL || (exports.SERVER_CHANNEL = SERVER_CHANNEL = {}));
