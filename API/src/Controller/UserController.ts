import { Router, Response, Request, NextFunction } from "express";
import IUserModel from '../Models/user.model';
import UserServices from "../Services/user.service";
import { CodigoHTTP } from "../Utilis/codigosHttp";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import activityLog from "../Utilis/activitylog";


const UserController = Router();

 // GetUsersByQuery api/users?search=
UserController.get("/", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    activityLog("controller", "UserController", "GetUsersByQuery");
    const data = await UserServices.GetUsersByQuery(req);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

// GetAllUsers
UserController.get("/all", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    activityLog("controller", "UserController", "GetALL");
    const data = await UserServices.GetAllUsers(req);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

// GetUser
UserController.get("/:id", async (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    activityLog("controller", "UserController", "GetUser");
    const data = await UserServices.GetUser(req.params.id);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

// AddUser
UserController.post("/", async (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    activityLog("controller", "UserController", "AddUser");
    const newUser:IUserModel = req.body;
    const data = await UserServices.AddUser(newUser);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});


// UpdatePassword
UserController.put("/change-password", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    activityLog("controller", "UserController", "UpdatePassword");
    const data = await UserServices.UpdatePassword(req);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

// UpdateUser
UserController.put("/:id", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    activityLog("controller", "UserController", "UpdateUser");
    const user:IUserModel = req.body;
    const data = await UserServices.UpdateUser(req.params.id, user);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

//DeleteUser
UserController.delete("/:id", async (req:WriteLineRequest, res:Response, next:NextFunction)=> {
  try {
    activityLog("controller", "UserController", "DeleteUser");
    const data = await UserServices.DeleteUser(req.params.id);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});

// GetUserImage
UserController.get("/image/:id", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    activityLog("controller", "UserController", "GetUserImage");
    const data = await UserServices.GetUserImage(req.params.id);
    return res.status(CodigoHTTP.OK).json(data);
  }
  catch(err:any){
    next(err);
  }
});


export default UserController;