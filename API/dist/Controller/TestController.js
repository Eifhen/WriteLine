"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestController = (0, express_1.Router)();
TestController.get("/", (req, res) => {
    try {
        // Lógica para obtener todos los datos
        return res.status(200).json("hola prueba");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = TestController;
