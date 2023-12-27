import mongoose, { Schema } from "mongoose";
import IUserModel, { IUserModelScheme } from "./user.model";
import { SchemeValidator } from "../Validations/scheme.validator";
import IMessageModel, { IMessageModelScheme } from "./message.model";

export interface IChatModel {
  _id?: mongoose.Types.ObjectId;
  name: string;
  isGroupChat: boolean;
  isActive:boolean;
  latestMessage?: IMessageModel;
  groupAdmin?: IUserModel;
  creationDate: Date;
  users: IUserModel[];
}

/******************************************
 Schema AJV para la interfaz IChatModel
******************************************/
export const IChatModelScheme = {
  type:"object",
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
  definitions: { IUserModelScheme, IMessageModelScheme },
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateChatModel = SchemeValidator(IChatModelScheme);

/*********************************************
  Schema Mongoose para la tabla Chat
**********************************************/
const Chat_BD_Schema = new Schema<IChatModel>({
  name: { type:String, trim: true},
  isGroupChat: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  latestMessage: { 
    type: Schema.Types.ObjectId, 
    ref:"Message" 
  },
  groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  creationDate: { type: Date },
  users: [{
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
}, {
  timestamps: true
});

/********************************************
  Modelo de la entidad de la tabla Chat
*********************************************/
export const ChatModel = mongoose.model<IChatModel>("Chat", Chat_BD_Schema);