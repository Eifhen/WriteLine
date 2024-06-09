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
exports.UserService = void 0;
const codigosHttp_1 = require("../Utilis/codigosHttp");
const user_model_1 = require("../Models/user.model");
const error_handler_config_1 = require("../Configuration/error.handler.config");
const isEmpty_1 = require("../Utilis/isEmpty");
const response_handler_config_1 = require("../Configuration/response.handler.config");
const nanoid_1 = require("nanoid");
const user_dto_1 = require("../DTO/user.dto");
const image_manager_1 = __importDefault(require("../Utilis/image.manager"));
const transaction_manager_1 = __importDefault(require("../Utilis/transaction.manager"));
const enums_1 = require("../Utilis/enums");
const image_pattern_1 = require("../Patterns/image.pattern");
const activitylog_1 = __importDefault(require("../Utilis/activitylog"));
class UserService {
    constructor() {
        this.imageManager = new image_manager_1.default();
    }
    GetAllUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // busca todos los usuarios excepto el actualmente logeado
            (0, activitylog_1.default)("service", "UserService", "GetAllUsers");
            const current = req.currentUser;
            const find = yield user_model_1.UserModel.find({ _id: { $ne: current._id } }).lean().exec();
            if (find) {
                const usersDTO = find.map(u => (0, user_dto_1.ToUserDTO)(u));
                return (0, response_handler_config_1.ResponseHandler)(usersDTO, codigosHttp_1.MensajeHTTP.OK);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
        });
    }
    GetUsersByQuery(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, activitylog_1.default)("service", "UserService", "GetUsersByQuery");
                const current = req.currentUser;
                const { search } = req.query;
                if (search === enums_1.SearchCommands.All) {
                    const find = yield user_model_1.UserModel.find({ _id: { $ne: current._id } }).lean().exec();
                    const usersDTO = find.map(u => (0, user_dto_1.ToUserDTO)(u));
                    return (0, response_handler_config_1.ResponseHandler)(usersDTO, codigosHttp_1.MensajeHTTP.OK);
                }
                else {
                    const keywords = {
                        $or: [
                            { nombre: { $regex: search !== null && search !== void 0 ? search : '', $options: 'i' } },
                            { email: { $regex: search !== null && search !== void 0 ? search : '', $options: 'i' } }
                        ]
                    };
                    // busca los usuarios que cuyo email o nombre corresponda a la keyword enviada por el queryString
                    // excepto el usuario actual logeado.
                    const users = yield user_model_1.UserModel.find(keywords).find({ _id: { $ne: current._id } }).lean().exec();
                    const usersDTO = users.map(u => (0, user_dto_1.ToUserDTO)(u));
                    return (0, response_handler_config_1.ResponseHandler)(usersDTO, codigosHttp_1.MensajeHTTP.OK);
                }
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, '', __filename);
            }
        });
    }
    GetUser(guid) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "GetUser");
            const find = yield user_model_1.UserModel.findOne({ guid });
            if (find) {
                const user = (0, user_dto_1.ToUserDTO)(find);
                if (((_a = user.image) === null || _a === void 0 ? void 0 : _a.fileName) && !((_b = user.image) === null || _b === void 0 ? void 0 : _b.url)) {
                    const { fileName, extension } = user.image;
                    user.image.url = yield this.imageManager.GetImageCloudURL(fileName, extension);
                }
                return (0, response_handler_config_1.ResponseHandler)(user, codigosHttp_1.MensajeHTTP.OK);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
        });
    }
    GetUsersById(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "GetUsersById");
            try {
                let users = [];
                for (var id of ids) {
                    const find = yield user_model_1.UserModel.findById(id).lean().exec();
                    if (find) {
                        users.push(find);
                    }
                }
                return users;
            }
            catch (error) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, error.message, __filename);
            }
        });
    }
    AddUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "AddUser");
            if ((0, isEmpty_1.isNotEmpty)(user) && (0, user_model_1.validateUserModel)(user)) {
                const newUser = new user_model_1.UserModel(Object.assign(Object.assign({}, user), { guid: (0, nanoid_1.nanoid)(10) }));
                const savedUser = yield newUser.save();
                return (0, response_handler_config_1.ResponseHandler)(savedUser, codigosHttp_1.MensajeHTTP.OK);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, '', __filename);
        });
    }
    UpdateUser(guid, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "UpdateUser");
            const { isValid, errors } = (0, user_dto_1.validateUserDTO)(user);
            if (isValid) {
                const find = yield user_model_1.UserModel.findOne({ guid }).exec();
                const { session, commitTransaction, rollBack } = yield (0, transaction_manager_1.default)();
                if (find) {
                    try {
                        find.nombre = user.nombre;
                        find.apellido = user.apellido;
                        find.email = user.email;
                        if (user.password) {
                            find.password = user.password;
                        }
                        if (user.image && user.image.base64) {
                            user.image.fileName = this.imageManager.setUserImageName(find.guid);
                            if (find.image && (0, isEmpty_1.isNotEmpty)(find.image.fileName) && (0, isEmpty_1.isNotEmpty)(find.image.extension)) {
                                // si ya existe una imagen la removemos
                                yield this.imageManager.DeleteImageFromCloud(find.image.fileName, find.image.extension);
                            }
                            const base64Data = user.image.base64.replace(image_pattern_1.IMAGE_BASE64_PATTERN, '');
                            const result = yield this.imageManager.SaveImageInCloud(user.image.fileName, user.image.extension, base64Data);
                            find.image = {
                                base64: '', // el base64 no lo guardo en la bd;
                                fileName: user.image.fileName,
                                extension: user.image.extension,
                                url: result.url
                            };
                        }
                        const updatedUser = yield find.save({ session });
                        const userDTO = (0, user_dto_1.ToUserDTO)(updatedUser);
                        if (user.image && user.image.base64 && user.image.extension && userDTO.image) {
                            //userDTO.image.base64 = this.imageManager.GetImageFormat(user.image.base64, user.image.extension);
                            userDTO.image.url = (_a = updatedUser.image) === null || _a === void 0 ? void 0 : _a.url;
                        }
                        yield commitTransaction();
                        return (0, response_handler_config_1.ResponseHandler)(userDTO, codigosHttp_1.MensajeHTTP.OK);
                    }
                    catch (err) {
                        yield rollBack();
                        throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, err.message, __filename);
                    }
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, errors, __filename);
        });
    }
    DeleteUser(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "DeleteUser");
            const deletedUser = yield user_model_1.UserModel.findOneAndDelete({ guid }).lean().exec();
            if (deletedUser) {
                return (0, response_handler_config_1.ResponseHandler)(deletedUser, codigosHttp_1.MensajeHTTP.Deleted);
            }
            throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, '', __filename);
        });
    }
    GetUserImage(guid) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "GetUserImage");
            try {
                const find = yield user_model_1.UserModel.findOne({ guid }).lean().exec();
                if (find) {
                    const user = (0, user_dto_1.ToUserDTO)(find);
                    if ((_a = user.image) === null || _a === void 0 ? void 0 : _a.fileName) {
                        const { fileName, extension } = user.image;
                        if ((_b = user.image) === null || _b === void 0 ? void 0 : _b.url) {
                            return (0, response_handler_config_1.ResponseHandler)((_c = user.image) === null || _c === void 0 ? void 0 : _c.url, codigosHttp_1.MensajeHTTP.OK);
                        }
                        //const base64 = await this.imageManager.GetImage(fileName, extension);
                        const url = yield this.imageManager.GetImageCloudURL(fileName, extension);
                        return (0, response_handler_config_1.ResponseHandler)(url, codigosHttp_1.MensajeHTTP.OK);
                    }
                    throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, 'Sin imagen', __filename);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.NotFound, 'Error al buscar el usuario', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
    UpdatePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, activitylog_1.default)("service", "UserService", "UpdatePassword");
            try {
                const currentUser = req.currentUser;
                const newPassword = req.body.password;
                if (currentUser) {
                    currentUser.password = newPassword;
                    yield currentUser.save();
                    return (0, response_handler_config_1.ResponseHandler)('Contraseña actualizada.', codigosHttp_1.MensajeHTTP.OK);
                }
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.BadRequest, '', __filename);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(err.status, err.message, err.path);
            }
        });
    }
}
exports.UserService = UserService;
const UserServices = new UserService();
exports.default = UserServices;
