import { SchemeValidator } from "../Validations/scheme.validator";




export default interface IMessageDTO {
  idChat:string;
  message:string;
}

export const IMessageDTOSchema = {
  type:"object",
  title: "MessageDTO",
  description:"Esquema para validar IMessageDTO",
  properties: {
    idChat: {
      type: "string",
      errorMessage: {
        required: "Este campo es requerido"
      }
    },
    message: {
      type:"string",
      errorMessage: {
        required: "Este campo es requerido"
      }
    },
  },
  additionalProperties: false,
  required: ["message", "idChat"],
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateMessageDTO = SchemeValidator(IMessageDTOSchema);