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
const promises_1 = __importDefault(require("fs/promises"));
const error_handler_config_1 = require("../Configuration/error.handler.config");
const codigosHttp_1 = require("./codigosHttp");
const image_pattern_1 = require("../Patterns/image.pattern");
const path_1 = __importDefault(require("path"));
const cloudinary_manager_1 = __importDefault(require("../Configuration/cloudinary.manager"));
class ImageManager {
    constructor(newPath) {
        /** Guarda la imagen en el servidor y retorna el nombre del archivo*/
        this.SaveImage = (imageBase64, fileName, extension, customPath) => __awaiter(this, void 0, void 0, function* () {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const folderPath = customPath || this._path;
            try {
                yield promises_1.default.access(folderPath);
            }
            catch (err) {
                // si el folder no existe lo crea
                yield promises_1.default.mkdir(folderPath, { recursive: true });
            }
            const imagePath = path_1.default.join(folderPath, `${fileName}.${extension}`); // Ruta donde se guardará la imagen
            yield promises_1.default.writeFile(imagePath, buffer); // Guarda la imagen en el servidor
            return fileName;
        });
        /** Elimina la imagen del servidor */
        this.RemoveImage = (imageName, extension, imagePath) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fullFileName = `${imageName}.${extension}`;
                const image = `${imagePath !== null && imagePath !== void 0 ? imagePath : this._path}/${fullFileName}`;
                // Verifica si el archivo existe antes de intentar eliminarlo
                yield promises_1.default.access(image);
                // Elimina el archivo
                yield promises_1.default.unlink(image);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar eliminar el archivo: ${err.message}`, __filename);
            }
        });
        /** Obtiene la imagen deseada en base64 */
        this.GetImage = (fileName, extension, path) => __awaiter(this, void 0, void 0, function* () {
            try {
                const imagePath = `${path !== null && path !== void 0 ? path : this._path}/${fileName}.${extension}`;
                const data = yield promises_1.default.readFile(imagePath);
                const base64 = Buffer.from(data).toString('base64');
                const imgSrc = `data:image/${extension};base64,${base64}`;
                return imgSrc;
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar obtener el archivo: ${err.message}`, __filename);
            }
        });
        this.GetImageFormat = (base64, extension) => {
            const imageBase64 = base64.replace(image_pattern_1.IMAGE_BASE64_PATTERN, '');
            return `data:image/${extension};base64,${imageBase64}`;
        };
        this.setUserImageName = (guid) => {
            return `user_${guid}`;
        };
        this.SaveImageInCloud = (fileName, extension, imageBase64) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                return yield cloudinary_manager_1.default.UploadImage(fileName, extension, imageBase64);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)((_a = err.status) !== null && _a !== void 0 ? _a : codigosHttp_1.CodigoHTTP.InternalServerError, err.message, (_b = err.path) !== null && _b !== void 0 ? _b : __filename);
            }
        });
        this.GetImageCloudURL = (fileName, extension) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            try {
                return yield cloudinary_manager_1.default.GetImage(fileName, extension);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)((_c = err.status) !== null && _c !== void 0 ? _c : codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar guardar el archivo: ${err.message}`, (_d = err.path) !== null && _d !== void 0 ? _d : __filename);
            }
        });
        this.DeleteImageFromCloud = (fileName, extension) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield cloudinary_manager_1.default.DeleteImage(fileName, extension);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar eliminar el archivo: ${err.message}`, __filename);
            }
        });
        this._path = newPath || path_1.default.join(__dirname, '../Store/UserImages');
    }
}
exports.default = ImageManager;
