import { Router, Response, Request, NextFunction } from "express";
import IUserModel from '../Models/user.model';
import UserServices from "../Services/user.service";


const UserController = Router();
 
UserController.get("/", (req:Request, res:Response, next:NextFunction)=>{
  try {
    const data = UserServices.GetUsers();
    return res.status(200).json(data);
  }
  catch(err:any){
    next(err);
  }
});

UserController.get("/:id", (req:Request, res:Response, next:NextFunction)=> {
  try {
    const data = UserServices.GetUser(req.params.id);
    return res.status(200).json(data);
  }
  catch(err:any){
    next(err);
  }
});

UserController.post("/", (req:Request, res:Response, next:NextFunction)=> {
  try {
    const newUser:IUserModel = req.body;
    const data = UserServices.AddUser(newUser);
    return res.status(200).json(data);
  }
  catch(err:any){
    next(err);
  }
})

UserController.put("/:id", (req:Request, res:Response, next:NextFunction)=>{
  try {
    const user:IUserModel = req.body;
    const data = UserServices.UpdateUser(req.params.id, user);
    return res.status(200).json(data);
  }
  catch(err:any){
    next(err);
  }
})

UserController.delete(":id", (req:Request, res:Response, next:NextFunction)=> {
  try {
    const data = UserServices.DeleteUser(req.params.id);
    return res.status(200).json(data);
  }
  catch(err:any){
    next(err);
  }
});


export default UserController;