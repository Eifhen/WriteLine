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
const chat_service_1 = __importDefault(require("../Services/chat.service"));
const ChatController = (0, express_1.Router)();
// GetAllChats
ChatController.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.GetAllChats(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
// AccessChat
ChatController.get("/access/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.AccessChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
// CreateGroupChat
ChatController.post("/group/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.CreateGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//AccessGroupChat
ChatController.get("/group/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.AccessGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//RenameGroupChat
ChatController.post("/group/rename/:id/:newName", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.RenameGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//AddUsersToGroupChat
ChatController.post("/group/:id/add-users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.AddUsersToGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//RemoveUsersFromGroupChat
ChatController.delete("/group/:id/remove-users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.RemoveUsersFromGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//GetAllActiveChats
ChatController.get("/actives", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.GetAllActiveChats(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//UpdateGroupChat
ChatController.put("/group/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.UpdateGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
//DeleteGroupChat
ChatController.delete("/group/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield chat_service_1.default.DeleteGroupChat(req);
        return res.status(200).json(service);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = ChatController;
