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
const nanoid_1 = require("nanoid");
const user_model_1 = require("../Models/user.model");
const codigosHttp_1 = require("../Utilis/codigosHttp");
const error_handler_config_1 = require("../Configuration/error.handler.config");
const response_handler_config_1 = require("../Configuration/response.handler.config");
const image_manager_1 = __importDefault(require("../Utilis/image.manager"));
const transaction_manager_1 = __importDefault(require("../Utilis/transaction.manager"));
const image_pattern_1 = require("../Patterns/image.pattern");
const isEmpty_1 = require("../Utilis/isEmpty");
class SignUpService {
    Register(data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const guid = (0, nanoid_1.nanoid)(10);
            const imageManager = new image_manager_1.default();
            const imageFileName = imageManager.setUserImageName(guid);
            const { session, commitTransaction, rollBack } = yield (0, transaction_manager_1.default)();
            try {
                const { isValid, errors } = (0, user_model_1.validateUserModel)(data);
                if (isValid) {
                    // Guardar la imagen en el servidor
                    if ((_a = data.image) === null || _a === void 0 ? void 0 : _a.base64) {
                        const extension = data.image.extension;
                        const base64Data = data.image.base64.replace(image_pattern_1.IMAGE_BASE64_PATTERN, '');
                        // data.image.fileName = await imageManager.SaveImage(base64Data, imageFileName, extension);
                        const result = yield imageManager.SaveImageInCloud(imageFileName, extension, base64Data);
                        data.image.fileName = imageFileName;
                        data.image.url = result.url;
                        data.image.base64 = '';
                    }
                    const newUser = new user_model_1.UserModel(Object.assign(Object.assign({}, data), { guid }));
                    yield newUser.save({ session });
                    yield commitTransaction(); // Confirma la transacción
                    return (0, response_handler_config_1.ResponseHandler)(newUser, codigosHttp_1.MensajeHTTP.OK);
                }
                else {
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, "El formulario ingresado es invalido.", __filename);
                }
            }
            catch (err) {
                yield rollBack();
                if (data.image &&
                    (0, isEmpty_1.isNotEmpty)((_b = data.image) === null || _b === void 0 ? void 0 : _b.base64) &&
                    (0, isEmpty_1.isNotEmpty)(data.image.fileName) &&
                    (0, isEmpty_1.isNotEmpty)(data.image.extension)) {
                    //await imageManager.RemoveImage(imageFileName, data.image.extension);
                    yield imageManager.DeleteImageFromCloud(imageFileName, data.image.extension);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, err.message, (_c = err.path) !== null && _c !== void 0 ? _c : __filename);
            }
        });
    }
}
const SignUpServices = new SignUpService();
exports.default = SignUpServices;
