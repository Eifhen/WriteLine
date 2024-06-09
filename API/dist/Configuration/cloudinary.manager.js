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
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const error_handler_config_1 = require("./error.handler.config");
const codigosHttp_1 = require("../Utilis/codigosHttp");
class CloudinaryManager {
    constructor() {
        this.UploadImage = (imageName, extension, fileBase64) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Upload Image =>", imageName, extension);
                this.initializeCloudinaryConfig();
                const res = yield cloudinary_1.v2.uploader.upload(`data:image/${extension};base64,${fileBase64}`, {
                    public_id: imageName
                });
                return res;
            }
            catch (err) {
                console.log("Error ClodinaryManager =>", err);
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar guardar el archivo: ${err.message}`, __filename);
            }
        });
        this.GetImage = (imageName, extension) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Get Image =>", imageName, extension);
                this.initializeCloudinaryConfig();
                return cloudinary_1.v2.url(`${imageName}`, { secure: true });
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar obtener la imagen: ${err.message}`, __filename);
            }
        });
        this.DeleteImage = (imageName, extension) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Delete Image =>", imageName, extension);
                this.initializeCloudinaryConfig();
                return cloudinary_1.v2.uploader.destroy(imageName);
            }
            catch (err) {
                throw (0, error_handler_config_1.ErrorHandler)(codigosHttp_1.CodigoHTTP.InternalServerError, `Error al intentar obtener la imagen: ${err.message}`, __filename);
            }
        });
    }
    initializeCloudinaryConfig() {
        var _a, _b, _c;
        // CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@deeho16gc
        const CLOUDINARY_NAME = (_a = process.env.CLOUDINARY_NAME) !== null && _a !== void 0 ? _a : "";
        const CLOUDINARY_API_KEY = (_b = process.env.CLOUDINARY_API_KEY) !== null && _b !== void 0 ? _b : "";
        const CLOUDINARY_API_SECRET = (_c = process.env.CLOUDINARY_API_SECRET) !== null && _c !== void 0 ? _c : "";
        const CLOUDINARY_URL = `cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_NAME}`;
        const config = {
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET
        };
        cloudinary_1.v2.config(config);
    }
}
const cloudinaryManager = new CloudinaryManager();
exports.default = cloudinaryManager;
