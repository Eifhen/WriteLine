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
const consoleColor_1 = require("../Utilis/consoleColor");
const mongoose_1 = __importDefault(require("mongoose"));
/**
  Realiza la connección a la base de datos.
 */
function DatabaseManager(config) {
    const { connectionString } = config;
    if (connectionString) {
        connectToDataBase(connectionString, 5000);
    }
}
exports.default = DatabaseManager;
function connectToDataBase(connectionString, retryInterval = 5000) {
    return __awaiter(this, void 0, void 0, function* () {
        let retryTimer = null;
        const retryConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(connectionString);
                (0, consoleColor_1.ConsoleWarning)("Database connected");
            }
            catch (err) {
                // si falla la connección intentalo de nuevo en x milisegundos
                console.log("Database Error =>", err);
                retryTimer = setTimeout(() => {
                    (0, consoleColor_1.ConsoleWarning)("reTrying connection...");
                    connectToDataBase(connectionString, retryInterval);
                }, retryInterval);
            }
        });
        yield retryConnection();
        // Limpiar el temporizador cuando la conexión sea exitosa
        if (retryTimer) {
            clearInterval(retryTimer);
        }
    });
}
