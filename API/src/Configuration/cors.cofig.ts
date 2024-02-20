import cors from 'cors';
import { RequestHandler } from 'express';

// Configuración de CORS
const corsOptions: cors.CorsOptions = {
  origin: "*", //['http://localhost:5173','http://localhost:5000'], // rutas que pueden hacer request a mi servidor
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
};

// Middleware de CORS
export const CorsHandler: RequestHandler = cors(corsOptions);