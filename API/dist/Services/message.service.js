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
const mongoose_1 = require("mongoose");
const error_handler_config_1 = require("../Configuration/error.handler.config");
const response_handler_config_1 = require("../Configuration/response.handler.config");
const message_dto_1 = require("../DTO/message.dto");
const chat_model_1 = require("../Models/chat.model");
const message_model_1 = require("../Models/message.model");
const codigosHttp_1 = require("../Utilis/codigosHttp");
class MessageServices {
    SendMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const currentUser = req.currentUser;
                const { isValid, errors } = (0, message_dto_1.validateMessageDTO)(data);
                if (isValid && currentUser) {
                    const chat = yield chat_model_1.ChatModel.findById(data.idChat);
                    if (chat) {
                        const addedMessage = yield message_model_1.MessageModel.create({
                            sender: currentUser,
                            content: data.message,
                            chat: chat,
                            date: new Date()
                        });
                        yield addedMessage.populate("sender", "-password");
                        yield addedMessage.populate("chat");
                        yield addedMessage.populate({
                            path: "chat",
                            populate: {
                                path: "users",
                                select: "-password"
                            }
                        });
                        chat.latestMessage = addedMessage;
                        yield chat.save();
                        return (0, response_handler_config_1.ResponseHandler)(addedMessage, codigosHttp_1.MensajeHTTP.OK);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, "No se encontro un chat con este id", __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, errors, __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    ;
    GetAllMessages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatID } = req.params;
                if (chatID) {
                    const id = new mongoose_1.Types.ObjectId(chatID);
                    const messages = yield message_model_1.MessageModel.find({
                        chat: id
                    })
                        .populate("sender", "-password")
                        .populate("chat");
                    if (messages) {
                        return (0, response_handler_config_1.ResponseHandler)(messages, codigosHttp_1.MensajeHTTP.OK);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadGateway, '', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    ;
}
const MessageService = new MessageServices();
exports.default = MessageService;
