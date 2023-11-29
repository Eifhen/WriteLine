import { Router, Response, Request, NextFunction } from "express";
import IUserModel from '../Models/user.model';
import UserServices from "../Services/user.service";
import { CodigoHTTP } from "../Utilis/codigosHttp";
import WriteLineRequest from "../Interfaces/auth.request.interface";


const UserController = Router();
 
UserController.get("/", (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    const data = UserServices.GetUsers();
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

UserController.get("/:id", (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    const data = UserServices.GetUser(req.params.id);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

UserController.post("/", (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    const newUser:IUserModel = req.body;
    const data = UserServices.AddUser(newUser);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
})

UserController.put("/:id", (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    const user:IUserModel = req.body;
    const data = UserServices.UpdateUser(req.params.id, user);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
})

UserController.delete(":id", (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    const data = UserServices.DeleteUser(req.params.id);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});


export default UserController;