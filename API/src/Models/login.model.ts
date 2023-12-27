import { PASSWORD_PATTERN_STR } from "../Patterns/password.pattern";
import { SchemeValidator } from "../Validations/scheme.validator";


/** 
  Interfaz para el inicio de sesión
**/
export default interface ILoginModel {
  email:string;
  password:string;
}

/** 
  Esquema para la interfaz de inicio de sesión
**/
export const ILoginModelScheme = {
  title:"Login Scheme",
  description:"Esquema para el objeto de Login",
  type: 'object',
  properties: {
    email: { 
      description: "Hace referencia al email del usuario",
      type: "string", 
      format: "email",
      errorMessage: {
        type: "El email debe ser de tipo string",
        format: "El campo 'email' debe ser una dirección de correo electrónico válida",
      }
    },
    password: { 
      description: "Hace referencia al password del usuario",
      type: "string",
      pattern: PASSWORD_PATTERN_STR,
      errorMessage: {
        type: "La contraseña debe ser de tipo string",
        pattern: "La contraseña debe ser de 5-20 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)",
      }
    }
  }, 
  required : ["email", "password"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

/** 
  Funsión que valida el esquema de la interfaz de inicio de sesión
**/
export const validateLoginModel = SchemeValidator(ILoginModelScheme);
