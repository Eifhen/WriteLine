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
exports.UserModel = exports.validateUserModel = exports.IUserModelScheme = void 0;
const name_and_lastname_pattern_1 = require("../Patterns/name_and_lastname.pattern");
const password_pattern_1 = require("../Patterns/password.pattern");
const encrypt_1 = require("../Utilis/encrypt");
const scheme_validator_1 = require("../Validations/scheme.validator");
const mongoose_1 = __importStar(require("mongoose"));
/******************************************
 Schema AJV para la interfaz IUserModel
******************************************/
exports.IUserModelScheme = {
    title: "IUserModel Scheme",
    type: "object",
    description: "Esquema para el objeto IUserModel",
    properties: {
        _id: {
            type: "string"
        },
        guid: {
            type: "string"
        },
        nombre: {
            type: "string",
            pattern: name_and_lastname_pattern_1.NAME_AND_LASTNAME_PATTERN_STR,
            errorMessage: {
                pattern: "El nombre debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
            }
        },
        apellido: {
            type: "string",
            pattern: name_and_lastname_pattern_1.NAME_AND_LASTNAME_PATTERN_STR,
            errorMessage: {
                pattern: "El apellido debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial."
            }
        },
        email: {
            type: "string",
            format: "email",
            errorMessage: {
                format: "El formato del email no es valido."
            }
        },
        password: {
            type: "string",
            pattern: password_pattern_1.PASSWORD_PATTERN_STR,
            errorMessage: {
                type: "La contraseña debe ser de tipo string",
                pattern: "La contraseña debe ser de 5-100 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)",
            }
        },
        createdAt: {
            type: "string",
            format: "date-time", // Asegúrate de tener este formato según tus necesidades
            errorMessage: {
                format: "La propiedad 'createdAt' debe ser una cadena de fecha y hora en el formato ISO8601."
            }
        },
        image: {
            type: "object"
        },
        amigos: {
            type: "array",
            items: { $ref: '#' }
        }
    },
    required: ["nombre", "apellido", "email", "password"],
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "No deben existir propiedades adicionales"
    }
};
/**********************************************
  Funsión que valida que un objeto cumpla con
  el Schema de la interfaz
**********************************************/
exports.validateUserModel = (0, scheme_validator_1.SchemeValidator)(exports.IUserModelScheme);
/*********************************************
  Schema Mongoose para la tabla User
**********************************************/
const User_BD_Schema = new mongoose_1.Schema({
    guid: { type: String, required: false },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
        type: Object, required: false
    },
    amigos: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }]
}, {
    timestamps: true
});
// cada vez que se guarda un documento encriptamos
// la propiedad password para que la misma no se 
// guarde en texto plano
User_BD_Schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified) {
            next();
        }
        this.password = yield (0, encrypt_1.EncryptPassword)(this.password);
    });
});
// User_BD_Schema.methods.matchPassword = async function(password:string){
//   return await ComparePassword(password, this.password);
// }
/********************************************
  Modelo de la entidad de la tabla User
*********************************************/
exports.UserModel = mongoose_1.default.model("User", User_BD_Schema);
