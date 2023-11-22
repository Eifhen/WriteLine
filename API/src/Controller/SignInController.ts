
import { Request, Response, NextFunction, Router } from 'express';
import ILoginModel from '../Models/login.model';
import { CodigoHTTP } from '../Configuration/codigos.http.config';
import SignInServices from '../Services/signin.service';





const SignInController = Router();

SignInController.post("/", (req: Request, res:Response, next:NextFunction)=>{
  try {
    const data:ILoginModel = req.body;
    console.log("login data =>", data);
    const service = SignInServices.Login(data);
    return res.status(CodigoHTTP.OK).json(service);
  }
  catch(err:any){
    next(err);
  }
});


export default SignInController;