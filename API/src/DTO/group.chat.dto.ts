import { SchemeValidator } from "../Validations/scheme.validator";

export default interface IGroupChatDTO {
  idGroup?:string;
  name:string;
  idUsers: string[];
}

export const IGroupChatDTOSchema = {
  type:"object",
  title: "GroupChatDTO",
  description:"Esquema para validar GroupChatDTO",
  properties: {
    idGroup: {
      type: "string",
    },
    name: {
      type:"string",
      errorMessage: {
        required: "Este campo es requerido"
      }
    },
    idUsers: {
      type:"array",
      errorMessage: {
        required:"Este campo es requerido"
      }
    }
  },
  additionalProperties: false,
  required: ["name", "idUsers"],
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateGroupChatDTO = SchemeValidator(IGroupChatDTOSchema);