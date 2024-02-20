"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codigosHttp_1 = require("../Utilis/codigosHttp");
const error_handler_config_1 = require("../Configuration/error.handler.config");
const response_handler_config_1 = require("../Configuration/response.handler.config");
const login_model_1 = require("../Models/login.model");
const token_1 = __importDefault(require("../Utilis/token"));
const user_model_1 = require("../Models/user.model");
const encrypt_1 = require("../Utilis/encrypt");
class SignInService {
    Login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const { isValid, errors } = (0, login_model_1.validateLoginModel)(data);
            // Valida el email y password
            if (!isValid) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, JSON.stringify(errors), __filename);
            }
            // Valida que el usuario exista
            const find = yield user_model_1.UserModel.findOne({ email }).exec();
            // Generar y Devolver JWToken
            if (find && (yield (0, encrypt_1.ComparePassword)(password, find.password))) {
                const token = (0, token_1.default)({ guid: find.guid, email: find.email, password: find.password });
                return (0, response_handler_config_1.ResponseHandler)(token, codigosHttp_1.MensajeHTTP.OK);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, "No existe un usuario con este email o contraseña", __filename);
        });
    }
}
const SignInServices = new SignInService();
exports.default = SignInServices;
