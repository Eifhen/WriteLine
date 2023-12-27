import { Router, Response, NextFunction } from "express";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import ChatService from "../Services/chat.service";


const ChatController = Router();

// GetAllChats
ChatController.get("/", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.GetAllChats(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

// AccessChat
ChatController.get("/access/:id", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.AccessChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})
 
// CreateGroupChat
ChatController.post("/group/create", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.CreateGroupChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

//AccessGroupChat
ChatController.get("/group/:id", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.AccessGroupChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

//RenameGroupChat
ChatController.post("/group/rename/:id/:newName", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.RenameGroupChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

//AddUsersToGroupChat
ChatController.post("/group/:id/add-users", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.AddUsersToGroupChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

//RemoveUsersFromGroupChat
ChatController.delete("/group/:id/remove-users", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.RemoveUsersFromGroupChat(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})

//GetAllActiveChats
ChatController.get("/actives", async (req:WriteLineRequest, res:Response, next:NextFunction) => {
  try {
    const service = await ChatService.GetAllActiveChats(req);
    res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
})


export default ChatController;