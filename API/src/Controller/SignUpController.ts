import { Router, Request, Response, NextFunction } from "express";
import IUserModel from "../Models/user.model";
import SignUpServices from "../Services/signup.service";
import { CodigoHTTP } from "../Utilis/codigosHttp";

const SignUpController = Router();

SignUpController.post("/", (req:Request, res:Response, next:NextFunction)=>{
  try {
    const data:IUserModel = req.body;
    console.log("data =>", data);
    const service = SignUpServices.Register(data);
    return res.status(CodigoHTTP.OK).json(service);
  }
  catch(err:any){
    next(err); // captura el error y lo manda al middleware que maneja los errores
  }
});

export default SignUpController;
