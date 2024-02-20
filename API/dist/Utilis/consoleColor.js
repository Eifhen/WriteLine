"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleBlue = exports.ConsoleWarning = void 0;
const safe_1 = __importDefault(require("colors/safe"));
function ConsoleError(title, msg) {
    console.error(safe_1.default.red(`${title} =>`), msg);
}
exports.default = ConsoleError;
function ConsoleWarning(title, msg) {
    console.warn(safe_1.default.yellow(title), msg !== null && msg !== void 0 ? msg : '');
}
exports.ConsoleWarning = ConsoleWarning;
function ConsoleBlue(title, msg) {
    console.warn(safe_1.default.cyan(title), msg !== null && msg !== void 0 ? msg : '');
}
exports.ConsoleBlue = ConsoleBlue;
