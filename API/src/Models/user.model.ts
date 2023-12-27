import { NAME_AND_LASTNAME_PATTERN_STR } from "../Patterns/name_and_lastname.pattern";
import { PASSWORD_PATTERN_STR } from "../Patterns/password.pattern";
import { ComparePassword, EncryptPassword } from "../Utilis/encrypt";
import { SchemeValidator } from "../Validations/scheme.validator";
import  mongoose, { Schema } from 'mongoose';



export default interface IUserModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  guid:string;
  nombre:string;
  apellido:string;
  email:string;
  password:string;
  image?:IUserImage;
  amigos?: IUserModel[];
  //matchPassword:(password: string) => Promise<boolean>;
}

export interface IUserImage {
  fileName:string;
  extension:string;
  base64?:string;
}

/******************************************
 Schema AJV para la interfaz IUserModel
******************************************/
export const IUserModelScheme = {
  title: "IUserModel Scheme",
  type: "object",
  description: "Esquema para el objeto IUserModel",
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
      type: "string",
      pattern:PASSWORD_PATTERN_STR,
      errorMessage: {
        type: "La contraseña debe ser de tipo string",
        pattern: "La contraseña debe ser de 5-100 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)",
      }
    },
    image: {
      type:"object"
    },
    amigos: {
      type:"array",
      items: { $ref: '#' }
    }
  },
  required: ["nombre","apellido","email","password"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

/**********************************************
  Funsión que valida que un objeto cumpla con 
  el Schema de la interfaz
**********************************************/
export const validateUserModel = SchemeValidator(IUserModelScheme);

/*********************************************
  Schema Mongoose para la tabla User 
**********************************************/
const User_BD_Schema = new Schema<IUserModel>({
  guid: { type: String, required: false },
  nombre: { type: String, required: true  },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  image: { 
    type: Object, required: false 
  },
  amigos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
},{
  timestamps: true
});

// cada vez que se guarda un documento encriptamos
// la propiedad password para que la misma no se 
// guarde en texto plano
User_BD_Schema.pre('save', async function (next){
  if(!this.isModified){ next(); }
  this.password = await EncryptPassword(this.password);
});

// User_BD_Schema.methods.matchPassword = async function(password:string){
//   return await ComparePassword(password, this.password);
// }
/********************************************
  Modelo de la entidad de la tabla User
*********************************************/
export const UserModel = mongoose.model<IUserModel>("User", User_BD_Schema);