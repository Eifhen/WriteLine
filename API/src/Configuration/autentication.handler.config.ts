import { NextFunction, RequestHandler, Request, Response, Express } from "express";
import { IConfiguracion } from "./configurations";
import { DecodeJWToken } from "../Utilis/token";
import { ErrorHandler } from "./error.handler.config";
import { usersData } from "../Data/users";
import { JwtPayload } from "jsonwebtoken";
import WriteLineRequest from "../Interfaces/auth.request.interface";


/*
  Este método debe validar que el token recibido sea valido
  y debe validar que el usuario recibido exista, de lo contrario
  el acceso a la API debe ser denegado.
*/
export default function AutenticationManager (config:IConfiguracion) : RequestHandler {

  return (req:WriteLineRequest, res:Response, next:NextFunction) => {
    const token = req.headers.authorization;
    if(token){
      const decode = DecodeJWToken(token) as JwtPayload;
      if(decode){
        // validar que el usuario exista;
        console.log("decode valido =>", decode);
        const currentUser = usersData.find(m => m.guid === decode.guid);
        if(currentUser){
          req.currentUser = currentUser;
          req.decodedToken = decode;
          return next();
        }
      
        console.log("usuario invalido");
        throw ErrorHandler(401);
      }
      else {
        console.log("decode invalido o token invalido =>", decode);
        throw ErrorHandler(401);
      }
    }
    console.log("Sin token", token);
    throw ErrorHandler(401);
  }
}





