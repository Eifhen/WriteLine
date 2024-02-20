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
const codigosHttp_1 = require("../Utilis/codigosHttp");
const signin_service_1 = __importDefault(require("../Services/signin.service"));
const SignInController = (0, express_1.Router)();
SignInController.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        console.log("login data =>", data);
        const service = yield signin_service_1.default.Login(data);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(service);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = SignInController;
