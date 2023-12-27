import { NextFunction, RequestHandler, Request, Response, Express } from "express";
import { IConfiguracion } from "./configurations";
import { DecodeJWToken } from "../Utilis/token";
import { ErrorHandler } from "./error.handler.config";
import { JwtPayload } from "jsonwebtoken";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import IUserModel, { UserModel } from "../Models/user.model";
import { CodigoHTTP } from "../Utilis/codigosHttp";


/*
  Este método debe validar que el token recibido sea valido
  y debe validar que el usuario recibido exista, de lo contrario
  el acceso a la API debe ser denegado.
*/
export default function AutenticationManager (config:IConfiguracion) : RequestHandler {

  return async (req:WriteLineRequest, res:Response, next:NextFunction) => {
    try {
      const token = req.headers.authorization;
      if(token){
        const decode = DecodeJWToken(token) as JwtPayload;
       
        if(decode){
          // validar que el usuario exista;
          const guid = decode.data.guid;
          const currentUser:IUserModel | null = await UserModel.findOne({guid}).lean().exec();
          if(currentUser){
            req.currentUser = currentUser;
            req.decodedToken = decode;
            return next();
          }
          throw ErrorHandler(CodigoHTTP.Unauthorized, "Usuario Invalido", __filename);
        }
      }
      throw ErrorHandler(CodigoHTTP.Unauthorized, `Sin Token: ${token}`, __filename);
    }
    catch(err){
      next(err);
    }
  }
}





