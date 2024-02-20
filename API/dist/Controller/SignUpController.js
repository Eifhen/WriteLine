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
const express_1 = require("express");
const signup_service_1 = __importDefault(require("../Services/signup.service"));
const codigosHttp_1 = require("../Utilis/codigosHttp");
const SignUpController = (0, express_1.Router)();
SignUpController.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const service = yield signup_service_1.default.Register(data);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(service);
    }
    catch (err) {
        next(err); // captura el error y lo manda al middleware que maneja los errores
    }
}));
exports.default = SignUpController;
