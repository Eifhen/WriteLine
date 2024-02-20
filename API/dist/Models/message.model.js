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
exports.MessageModel = exports.validateMessageModel = exports.IMessageModelScheme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = require("./user.model");
const scheme_validator_1 = require("../Validations/scheme.validator");
/******************************************
 Schema AJV para la interfaz IMessageModel
******************************************/
exports.IMessageModelScheme = {
    type: "object",
    title: "IMessageModelScheme",
    description: "Esquema para la interfaz IMessageModel",
    properties: {
        _id: { type: "string" },
        sender: {
            type: "object",
            $ref: "#/definitions/IUserModelScheme",
            errorMessage: {
                required: "El sender es requerido",
            }
        },
        content: {
            type: "string",
            errorMessage: {
                required: "El menssaje es requerido"
            }
        },
        chat: {
            type: "object",
            errorMessage: {
                required: "El chat es requerido"
            }
        },
        date: {
            type: "string",
            format: "date",
            errorMessage: {
                required: "La fecha es requerida"
            }
        }
    },
    additionalProperties: false,
    required: ["sender", "content", "chat", "date"],
    definitions: { IUserModelScheme: user_model_1.IUserModelScheme },
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
exports.validateMessageModel = (0, scheme_validator_1.SchemeValidator)(exports.IMessageModelScheme);
/*********************************************
  Schema Mongoose para la tabla Message
**********************************************/
const Message_BD_Schema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat",
    },
    content: { type: String },
    date: { type: Date }
}, {
    timestamps: true,
});
/********************************************
  Modelo de la entidad de la tabla Message
*********************************************/
exports.MessageModel = mongoose_1.default.model("Message", Message_BD_Schema);
