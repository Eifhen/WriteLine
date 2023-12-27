import mongoose, { Schema } from 'mongoose';
import { IChatModel, IChatModelScheme } from './chat.model';
import IUserModel from "./user.model";
import { IUserModelScheme } from './user.model';
import { SchemeValidator } from '../Validations/scheme.validator';

export default interface IMessageModel {
  sender: IUserModel;
  content: string;
  chat: IChatModel;
  date: Date;
}

/******************************************
 Schema AJV para la interfaz IMessageModel
******************************************/
export const IMessageModelScheme = {
  type: "object",
  title: "IMessageModelScheme",
  description: "Esquema para la interfaz IMessageModel",
  properties:{
    sender: { 
      type:"object", 
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
  definitions: { IUserModelScheme },
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateMessageModel = SchemeValidator(IMessageModelScheme);

/*********************************************
  Schema Mongoose para la tabla Message
**********************************************/
const Message_BD_Schema = new Schema<IMessageModel>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  chat: { 
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
  content: { type: String },
  date: { type: Date }
},{
  timestamps: true,
}); 

/********************************************
  Modelo de la entidad de la tabla Message
*********************************************/
export const MessageModel = mongoose.model<IMessageModel>("Message", Message_BD_Schema);