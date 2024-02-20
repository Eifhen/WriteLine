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
/*
  En este archivo configuramos nuestro servidor de express
*/
const express_1 = __importDefault(require("express"));
const configurations_1 = __importDefault(require("./Configuration/configurations"));
const router_manager_1 = __importDefault(require("./Router/router.manager"));
const error_handler_config_1 = require("./Configuration/error.handler.config");
const cors_cofig_1 = require("./Configuration/cors.cofig");
const database_config_1 = __importDefault(require("./Configuration/database.config"));
const consoleColor_1 = require("./Utilis/consoleColor");
const http_1 = require("http");
const socket_config_1 = __importDefault(require("./Configuration/socket.config"));
function Startup() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const config = (0, configurations_1.default)();
        const JsonHandler = express_1.default.json({ limit: "10mb" });
        const RouterHandler = (0, router_manager_1.default)(config);
        const server = (0, http_1.createServer)(app);
        const port = config.port;
        (0, database_config_1.default)(config);
        (0, socket_config_1.default)(server);
        app.use(cors_cofig_1.CorsHandler);
        app.use(JsonHandler);
        app.use("/api", RouterHandler);
        app.use(error_handler_config_1.RequestErrorHandler);
        // ---------------- DEPLOYMENT ------------------
        config.Deploy(app, express_1.default);
        // ---------------- DEPLOYMENT ------------------
        server.listen(port, () => {
            (0, consoleColor_1.ConsoleWarning)(`Server Started on PORT ${config.port}`);
        });
    });
}
Startup();
