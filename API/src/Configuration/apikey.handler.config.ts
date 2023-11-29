import { NextFunction, RequestHandler, Request, Response } from "express";
import { IConfiguracion } from "./configurations";
import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";


/** 
  MiddleWare para manejar la validación del API_Key
**/
export default function ApiKeyManager(config:IConfiguracion) : RequestHandler {
  return (req:Request, res:Response, next:NextFunction) => {
    const incomingApiKey = req.headers[config.apikeyHeader!];
    if (incomingApiKey === config.apikey) {
      // La API_KEY es válida, permite la solicitud
      next();
    } else {
      // La API_KEY es inválida, devuelve un error de acceso no autorizado
      console.log("API KEY Invalida");
      return res.status(CodigoHTTP.Forbidden).json({ error: MensajeHTTP.Forbidden});
    }
  };
}

