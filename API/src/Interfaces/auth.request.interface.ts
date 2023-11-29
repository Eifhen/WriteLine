import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import IUserModel from "../Models/user.model";


/*
  Interfaz que nos permite agregar el token decodificado
  y el usuario actual a la request
*/
export default interface WriteLineRequest extends Request {
  decodedToken?: string | JwtPayload;
  currentUser?: IUserModel;
}