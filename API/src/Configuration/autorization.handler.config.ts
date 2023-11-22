import { RequestHandler, Response, Request, NextFunction } from "express";
import { ErrorHandler } from "./error.handler.config";
import { CodigoHTTP } from "./codigos.http.config";
import { IConfiguracion } from './configurations';
import jwt from 'jsonwebtoken';


export default function AutorizationManager (config:IConfiguracion) : [RequestHandler,  (data: any) => string]{
  const secretKey = config.tk_key!;

  // Generar un token
  const generateToken = (data: any) => {
    return jwt.sign(data, secretKey, { expiresIn: '1h' });
  };
  
  // Verificar un token
  const autorization = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers[config.autorizationHeader!];
    console.log("req =>", req.headers);
    console.log("config =>", config);
    console.log("token =>", token, config.autorizationHeader);
    if (token && typeof token === 'string') {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          throw ErrorHandler(CodigoHTTP.Unauthorized, 'Token Invalido');
        } 
        //req.user = decoded; // Guarda los datos decodificados si es necesario
        next();
      });
    } else {
      throw ErrorHandler(CodigoHTTP.Unauthorized, 'Token no proporcionado');
    }
  };

  return [autorization, generateToken];
}



