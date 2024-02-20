"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsHandler = void 0;
const cors_1 = __importDefault(require("cors"));
// Configuración de CORS
const corsOptions = {
    origin: "*", //['http://localhost:5173','http://localhost:5000'], // rutas que pueden hacer request a mi servidor
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
};
// Middleware de CORS
exports.CorsHandler = (0, cors_1.default)(corsOptions);
