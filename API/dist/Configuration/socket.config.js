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
const socket_io_1 = require("socket.io");
const consoleColor_1 = require("../Utilis/consoleColor");
const error_handler_config_1 = require("./error.handler.config");
const user_dto_1 = require("../DTO/user.dto");
const codigosHttp_1 = require("../Utilis/codigosHttp");
const channels_sockets_1 = require("../Utilis/channels.sockets");
const token_1 = require("../Utilis/token");
const user_model_1 = require("../Models/user.model");
const channles_manager_1 = __importDefault(require("../Utilis/channles.manager"));
function SocketManager(httpServer) {
    const { JOINED_CHATS, ValidateBeforeJoinToRoom, GetRoomsByGUID, GetCurrentConnections, AddCurrentConnection, } = (0, channles_manager_1.default)();
    const io = new socket_io_1.Server(httpServer, {
        pingTimeout: 60000,
        cors: { origin: "*" }
    });
    // Socket Autentication
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = socket.handshake.auth.token;
            if (token) {
                const decode = (0, token_1.DecodeJWToken)(token);
                if (decode) {
                    // validar que el usuario exista;
                    const guid = decode.data.guid;
                    const currentUser = yield user_model_1.UserModel.findOne({ guid });
                    if (currentUser) {
                        socket.currentUser = currentUser;
                        socket.decodedToken = decode;
                        //console.log("Socket connection autenticated");
                        return next();
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Unauthorized, "Usuario Invalido", __filename);
                }
            }
            else {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.Forbidden, 'Error al autenticar la conección socket', __filename);
            }
        }
        catch (err) {
            console.error("error al autenticar el socket", __filename);
            next(err);
        }
    }));
    io.on(channels_sockets_1.SERVER_CHANNEL.Connection, (socket) => {
        (0, consoleColor_1.ConsoleBlue)(`Connected to socket.io => ${socket.id}`);
        AddCurrentConnection(socket.id); // agrega la conección al registro de connecciones
        console.log("Connected | current connections =>", GetCurrentConnections());
        // Crea un roon [SingleChat]
        socket.on(channels_sockets_1.SERVER_CHANNEL.CreateRoom, (userData) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { isValid, errors } = (0, user_dto_1.validateUserDTO)(userData);
                if (isValid) {
                    // crea un roon con el id del usuario logeado
                    const room = userData.guid;
                    const connection_id = socket.id;
                    ValidateBeforeJoinToRoom(connection_id, room, room, true, () => {
                        socket.join(room);
                        socket.emit(channels_sockets_1.SERVER_CHANNEL.Connection, `room ${room} has been created`);
                        console.log(`the user ${room} # ${connection_id} has created the room ${room}`);
                    });
                }
                else {
                    // Lanza un nuevo error
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, errors);
                }
            }
            catch (err) {
                console.error("error al crear el room =>", err.message, __filename);
                socket.emit(channels_sockets_1.SERVER_CHANNEL.Error, err.message); // Emite el error al cliente
            }
        }));
        // Join a chat 
        socket.on(channels_sockets_1.SERVER_CHANNEL.JoinChat, (data) => {
            try {
                const connection_id = socket.id;
                ValidateBeforeJoinToRoom(connection_id, data.chatId, data.guid, false, () => {
                    socket.join(data.chatId);
                    console.log(`user ${data.guid} #${connection_id} has joined the room/chat ${data.chatId}`);
                    console.log(`the current joined rooms of the user ${data.guid} are`, GetRoomsByGUID(data.guid));
                });
            }
            catch (err) {
                console.error("error al unirse al chat =>", err.message, __filename);
                socket.emit(channels_sockets_1.SERVER_CHANNEL.Error, err.message);
            }
        });
        // new Message [SingleChat] 
        socket.on(channels_sockets_1.SERVER_CHANNEL.NewMessage, (message) => {
            var _a;
            try {
                const chat = message.chat;
                if (chat && chat.users && message.sender && !((_a = message.chat) === null || _a === void 0 ? void 0 : _a.isGroupChat)) {
                    chat.users.forEach(user => {
                        var _a;
                        // si el usuario es distinto al emisor del mensaje
                        // entonces envía un mensaje al usuario destinatario
                        const destinatario = user.guid;
                        const emisor = (_a = message.sender) === null || _a === void 0 ? void 0 : _a.guid;
                        if (destinatario && emisor && destinatario != emisor) {
                            console.log("destinatario =>", GetRoomsByGUID(destinatario));
                            console.log("current connections =>", GetCurrentConnections());
                            socket.to(destinatario).emit(channels_sockets_1.SERVER_CHANNEL.MessageRecieved, message);
                        }
                    });
                }
                else {
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, "Error al enviar el mensaje", "socket.config/socket.on/new-message");
                }
            }
            catch (err) {
                console.error(err.message, err.path);
                socket.emit(channels_sockets_1.SERVER_CHANNEL.Error, err.message);
            }
        });
        // new Message [GroupChat]
        socket.on(channels_sockets_1.SERVER_CHANNEL.GroupMessage, (message) => {
            var _a;
            try {
                const chatID = (_a = message.chat) === null || _a === void 0 ? void 0 : _a._id;
                if (chatID) {
                    const id = chatID.toString();
                    socket.to(id).emit(channels_sockets_1.SERVER_CHANNEL.MessageRecieved, message);
                }
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, "Error al enviar el mensaje", "socket.config/socket.on/group-message");
            }
        });
        // UpdateGroup
        socket.on(channels_sockets_1.SERVER_CHANNEL.UpdateGroup, (destinatarios, chat, operation) => {
            try {
                destinatarios.map(destinatario => {
                    socket.to(destinatario).emit(channels_sockets_1.SERVER_CHANNEL.UpdatedGroup, destinatario, chat, operation);
                });
            }
            catch (_a) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, "Error al actualizar el chat", "socket.config/socket.on/update-group");
            }
        });
        // Some user is typing in a room/chat
        socket.on(channels_sockets_1.SERVER_CHANNEL.Typing, (data) => {
            socket.to(data.chatId).emit(channels_sockets_1.SERVER_CHANNEL.Typing, {
                isTyping: true,
                guid: data.guid,
                chatId: data.chatId,
            });
        });
        socket.on(channels_sockets_1.SERVER_CHANNEL.StopTyping, (data) => {
            socket.to(data.chatId).emit(channels_sockets_1.SERVER_CHANNEL.Typing, {
                isTyping: false,
                guid: data.guid,
                chatId: data.chatId,
            });
        });
        socket.on(channels_sockets_1.SERVER_CHANNEL.Desconecting, () => {
            //console.log("Disconnecting  | sockets rooms =>", socket.rooms);
        });
        socket.on(channels_sockets_1.SERVER_CHANNEL.Disconnect, () => {
            const connection_id = socket.id;
            // Elimina al usuario de todos los rooms/chats cuando se desconecta
            if (JOINED_CHATS[connection_id]) {
                JOINED_CHATS[connection_id].forEach((data) => {
                    socket.leave(data.chatId);
                    console.log(`The user ${data.guid} #${connection_id} has desconected from the chat ${data.chatId}`);
                });
                // removemos el usuario del objeto que lista las conecciones
                delete JOINED_CHATS[connection_id];
            }
            console.log("Disconected | remaining chats => ", JOINED_CHATS);
            console.log("Disconected | remaining connections =>", GetCurrentConnections());
        });
    });
}
exports.default = SocketManager;
