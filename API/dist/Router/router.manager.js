"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestController_1 = __importDefault(require("../Controller/TestController"));
const UserController_1 = __importDefault(require("../Controller/UserController"));
const SignUpController_1 = __importDefault(require("../Controller/SignUpController"));
const SignInController_1 = __importDefault(require("../Controller/SignInController"));
const autentication_handler_config_1 = __importDefault(require("../Configuration/autentication.handler.config"));
const ChatController_1 = __importDefault(require("../Controller/ChatController"));
const MessageController_1 = __importDefault(require("../Controller/MessageController"));
const apikey_handler_config_1 = __importDefault(require("../Configuration/apikey.handler.config"));
function RouterManager(config) {
    const autentication = (0, autentication_handler_config_1.default)(config);
    const validateApiKey = (0, apikey_handler_config_1.default)(config);
    const router = (0, express_1.Router)();
    router.use("/test", validateApiKey, TestController_1.default);
    router.use("/signup", validateApiKey, SignUpController_1.default);
    router.use("/signin", validateApiKey, SignInController_1.default);
    router.use("/users", validateApiKey, autentication, UserController_1.default);
    router.use("/chats", validateApiKey, autentication, ChatController_1.default);
    router.use("/messages", validateApiKey, autentication, MessageController_1.default);
    return router;
}
exports.default = RouterManager;
