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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = exports.validateChatModel = exports.IChatModelScheme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = require("./user.model");
const scheme_validator_1 = require("../Validations/scheme.validator");
const message_model_1 = require("./message.model");
/******************************************
 Schema AJV para la interfaz IChatModel
******************************************/
exports.IChatModelScheme = {
    type: "object",
    title: "IChatModelScheme",
    description: "Esquema para validar chats",
    properties: {
        _id: { type: "string" },
        name: { type: "string" },
        isGroupChat: { type: "boolean" },
        isActive: { type: "boolean" },
        latestMessage: { type: "object", $ref: "#/definitions/IMessageModelScheme" },
        groupAdmin: { type: "object", $ref: "#/definitions/IUserModelScheme" },
        creationDate: { type: "string", format: "date" },
        users: {
            type: "array",
            items: { $ref: "#/definitions/IUserModelScheme" }
        },
    },
    additionalProperties: false,
    required: ["name", "users"],
    definitions: { IUserModelScheme: user_model_1.IUserModelScheme, IMessageModelScheme: message_model_1.IMessageModelScheme },
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
exports.validateChatModel = (0, scheme_validator_1.SchemeValidator)(exports.IChatModelScheme);
/*********************************************
  Schema Mongoose para la tabla Chat
**********************************************/
const Chat_BD_Schema = new mongoose_1.Schema({
    name: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    latestMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    creationDate: { type: Date },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
}, {
    timestamps: true
});
/********************************************
  Modelo de la entidad de la tabla Chat
*********************************************/
exports.ChatModel = mongoose_1.default.model("Chat", Chat_BD_Schema);
