import mongoose from "mongoose";
import { NAME_AND_LASTNAME_PATTERN_STR } from "../Patterns/name_and_lastname.pattern";
import { SchemeValidator } from "../Validations/scheme.validator";
import IUserModel, { IUserImage } from "../Models/user.model";

export default interface IUserDTO {
  _id: mongoose.Types.ObjectId;
  guid:string;
  nombre:string;
  apellido:string;
  email:string;
  password?:string;
  image?:IUserImageDTO;
  date?: Date;
}

export interface IUserImageDTO{
  fileName:string;
  extension:string;
  base64?:string;
}

/******************************************
 Schema AJV para el DTO IUserDTO
******************************************/
export const IUserDTOScheme = {
  title: "IUserDTO Scheme",
  type: "object",
  description: "Esquema para el objeto IUserDTO",
  properties: {
    _id: {
      type: "string"
    },
    guid:{
      type:"string"
    },
    nombre:{
      type:"string",
      pattern: NAME_AND_LASTNAME_PATTERN_STR,
      errorMessage: {
        pattern: "El nombre debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
      }
    },
    apellido:{
      type:"string",
      pattern: NAME_AND_LASTNAME_PATTERN_STR,
      errorMessage: {
        pattern: "El apellido debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
      }
    },
    email:{
      type:"string",
      format:"email",
      errorMessage: {
        format:"El formato del email no es valido."
      }
    },
    password:{
      type:"string",
    },
    image: {
      type:"object"
    },
    date: {
      type:"string",
      format: "date-time"
    }
  },
  required: ["nombre","apellido","email"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

/**********************************************
  Funsión que valida que un objeto cumpla con 
  el Schema de la interfaz
**********************************************/
export const validateUserDTO = SchemeValidator(IUserDTOScheme);

export const ToUserDTO = (user:IUserModel) : IUserDTO => {
  return {
    _id: user._id,
    guid: user.guid,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    image: user.image,
    date: user.createdAt
  }
}

export const ToUserDTOWithPassword = (user:IUserModel) : IUserDTO => {
  return {
    _id: user._id,
    guid: user.guid,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    password: user.password,
    image: user.image,
    date: user.createdAt
  }
}

