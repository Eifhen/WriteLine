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
const user_service_1 = __importDefault(require("../Services/user.service"));
const codigosHttp_1 = require("../Utilis/codigosHttp");
const UserController = (0, express_1.Router)();
// GetUsersByQuery api/users?search=
UserController.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.GetUsersByQuery(req);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// GetAllUsers
UserController.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.GetAllUsers(req);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// GetUser
UserController.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.GetUser(req.params.id);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// AddUser
UserController.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        const data = yield user_service_1.default.AddUser(newUser);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// UpdatePassword
UserController.put("/change-password", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.UpdatePassword(req);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// UpdateUser
UserController.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const data = yield user_service_1.default.UpdateUser(req.params.id, user);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
//DeleteUser
UserController.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.DeleteUser(req.params.id);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
// GetUserImage
UserController.get("/image/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_service_1.default.GetUserImage(req.params.id);
        return res.status(codigosHttp_1.CodigoHTTP.OK).json(data);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = UserController;
