"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = require("mongoose");
const error_handler_config_1 = require("../Configuration/error.handler.config");
const response_handler_config_1 = require("../Configuration/response.handler.config");
const group_chat_dto_1 = require("../DTO/group.chat.dto");
const chat_model_1 = require("../Models/chat.model");
const user_model_1 = require("../Models/user.model");
const codigosHttp_1 = require("../Utilis/codigosHttp");
const user_service_1 = __importDefault(require("./user.service"));
const orderUsers_1 = __importStar(require("../Utilis/orderUsers"));
class ChatServices {
    /**
      Esta función crea la sala de chat entre el usuario logeado
      y un destinatario
    */
    AccessChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current = req.currentUser;
                const id_destinatario = req.params.id;
                const destinatario = yield user_model_1.UserModel.findById(id_destinatario).lean().exec();
                if (destinatario) {
                    const isChat = yield chat_model_1.ChatModel.find({
                        isGroupChat: false,
                        $and: [
                            { users: { $elemMatch: { $eq: current._id } } },
                            { users: { $elemMatch: { $eq: id_destinatario } } }
                        ]
                    })
                        .populate("users", "-password")
                        .populate({
                        path: "latestMessage",
                        populate: { path: "sender" }
                    });
                    if (isChat.length > 0) {
                        return (0, response_handler_config_1.ResponseHandler)(isChat[0], codigosHttp_1.MensajeHTTP.OK);
                    }
                    else {
                        // si el chat no existe crea uno nuevo
                        const newChat = {
                            name: `sender`,
                            isGroupChat: false,
                            isActive: true,
                            creationDate: new Date(),
                            users: [current, destinatario],
                        };
                        const createdChat = yield chat_model_1.ChatModel.create(newChat);
                        // devuelve el chat con el array de usuarios cargado
                        const fullChat = yield chat_model_1.ChatModel
                            .findOne({ _id: createdChat._id })
                            .populate("users", "-password") // carga el array de usuarios pero excluye la columna password
                            .lean().exec();
                        return (0, response_handler_config_1.ResponseHandler)(fullChat, codigosHttp_1.MensajeHTTP.Created);
                    }
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, codigosHttp_1.MensajeHTTP.NotFound, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    GetAllChats(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current = req.currentUser;
                const chats = yield chat_model_1.ChatModel.find({
                    users: { $elemMatch: { $eq: current._id } }
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                yield user_model_1.UserModel.populate(chats, {
                    path: "latestMessage.sender",
                    select: "nombre image email"
                });
                const orderedChats = (0, orderUsers_1.default)(chats);
                return (0, response_handler_config_1.ResponseHandler)(orderedChats, codigosHttp_1.MensajeHTTP.OK);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, codigosHttp_1.MensajeHTTP.BadRequest, __filename);
            }
        });
    }
    CreateGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = req.body;
                const { isValid, errors } = (0, group_chat_dto_1.validateGroupChatDTO)(group);
                if (isValid) {
                    if (group.idUsers.length >= 2) {
                        // agregamos el usuario logeado a la lista de usuarios del grupo
                        group.idUsers.push(req.currentUser._id.toString());
                        const users = yield user_service_1.default.GetUsersById(group.idUsers);
                        const createdGroup = yield chat_model_1.ChatModel.create({
                            name: group.name,
                            isGroupChat: true,
                            isActive: true,
                            groupAdmin: req.currentUser,
                            creationDate: new Date(),
                            users: users,
                        });
                        yield createdGroup.populate('users', "-password");
                        yield createdGroup.populate("groupAdmin", "-password");
                        const orderedChat = (0, orderUsers_1.OrderUsers)(createdGroup);
                        return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.Created);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, "El chat no tiene participantes suficientes", __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, errors, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    RenameGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, newName } = req.params;
                const find = yield chat_model_1.ChatModel.findOne({ _id: id }).where({ isGroupChat: true });
                if (find) {
                    find.name = newName;
                    const updatedChat = yield find.save();
                    yield updatedChat.populate("users", "-password");
                    yield updatedChat.populate("groupAdmin", "-password");
                    const orderedChat = (0, orderUsers_1.OrderUsers)(updatedChat);
                    return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.OK);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    AccessGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idChat = req.params.id;
                const chat = yield chat_model_1.ChatModel.findOne({ _id: idChat }).where({ isGroupChat: true });
                if (chat) {
                    yield chat.populate("users");
                    chat.isActive = true;
                    const updatedChat = yield chat.save();
                    const orderedChat = (0, orderUsers_1.OrderUsers)(updatedChat);
                    return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.OK);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    AddUsersToGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idChat = req.params.id;
                const group = req.body;
                const { isValid, errors } = (0, group_chat_dto_1.validateGroupChatDTO)(group);
                if (isValid) {
                    const chat = yield chat_model_1.ChatModel.findOne({ _id: idChat }).where({ isGroupChat: true });
                    if (chat) {
                        for (var id of group.idUsers) {
                            const user = yield user_model_1.UserModel.findById(id);
                            if (user) {
                                const find = chat.users.find(m => m._id.toString() === user._id.toString());
                                if (!find) {
                                    chat.users.push(user);
                                }
                                else {
                                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, `El usuario ya se encuentra en el grupo`, __filename);
                                }
                            }
                            else {
                                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, `El usuario no existe.`, __filename);
                            }
                        }
                        const updatedChat = yield chat.save();
                        yield updatedChat.populate("users", "-password");
                        yield updatedChat.populate("groupAdmin", "-password");
                        yield updatedChat.populate("latestMessage");
                        yield user_model_1.UserModel.populate(updatedChat, {
                            path: "latestMessage.sender",
                            select: "nombre apellido image email guid"
                        });
                        const orderedChat = (0, orderUsers_1.OrderUsers)(updatedChat);
                        return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.OK);
                    }
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, errors, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    RemoveUsersFromGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idChat = req.params.id;
                const group = req.body;
                const { isValid, errors } = (0, group_chat_dto_1.validateGroupChatDTO)(group);
                if (isValid) {
                    const chat = yield chat_model_1.ChatModel.findOne({ _id: idChat, isGroupChat: true });
                    if (chat) {
                        const toBeDeleted = group.idUsers.map(id => new mongoose_1.Types.ObjectId(id));
                        for (var idUser of toBeDeleted) {
                            if (idUser.equals(chat.groupAdmin._id)) {
                                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, 'Error: No puedes remover al Admin del grupo', __filename);
                            }
                            else {
                                chat.users = chat.users.filter((user) => !user._id.equals(idUser));
                            }
                        }
                        const updatedChat = yield chat.save();
                        yield updatedChat.populate("users", "-password");
                        yield updatedChat.populate("groupAdmin", "-password");
                        const orderedChat = (0, orderUsers_1.OrderUsers)(updatedChat);
                        return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.Deleted);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, errors, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    GetAllActiveChats(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current = req.currentUser;
                let chats = yield chat_model_1.ChatModel.find({
                    users: { $elemMatch: { $eq: current._id } },
                    isActive: true
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                yield user_model_1.UserModel.populate(chats, {
                    path: "latestMessage.sender",
                    select: "nombre apellido guid image email"
                });
                // ordenar
                chats = (0, orderUsers_1.default)(chats);
                return (0, response_handler_config_1.ResponseHandler)(chats, codigosHttp_1.MensajeHTTP.OK);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    UpdateGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idChat = req.params.id;
                const group = req.body;
                const { isValid, errors } = (0, group_chat_dto_1.validateGroupChatDTO)(group);
                if (isValid) {
                    const chat = yield chat_model_1.ChatModel.findOne({ _id: idChat, isGroupChat: true });
                    if (chat) {
                        const usersIds = group.idUsers.map(id => new mongoose_1.Types.ObjectId(id));
                        const usersPromises = usersIds.map(id => user_model_1.UserModel.findById(id).select('-password'));
                        const users = yield Promise.all(usersPromises);
                        chat.name = group.name;
                        chat.users = users.filter(user => user !== null);
                        const updatedChat = yield chat.save();
                        yield updatedChat.populate("users", "-password");
                        yield updatedChat.populate("groupAdmin", "-password");
                        yield updatedChat.populate("latestMessage");
                        yield user_model_1.UserModel.populate(updatedChat, {
                            path: "latestMessage.sender",
                            select: "nombre apellido image email guid"
                        });
                        const orderedChat = (0, orderUsers_1.OrderUsers)(updatedChat);
                        return (0, response_handler_config_1.ResponseHandler)(orderedChat, codigosHttp_1.MensajeHTTP.Deleted);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, errors, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    DeleteGroupChat(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idChat = req.params.id;
                const deletedChat = yield chat_model_1.ChatModel.findOneAndDelete({ _id: idChat }).lean().exec();
                if (deletedChat) {
                    return (0, response_handler_config_1.ResponseHandler)(deletedChat, codigosHttp_1.MensajeHTTP.Deleted);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
}
const ChatService = new ChatServices();
exports.default = ChatService;
