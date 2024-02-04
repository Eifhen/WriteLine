import { Router, Response, NextFunction } from "express";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import MessageService from "../Services/message.service";


const MessageController = Router();

// SendMessage
MessageController.post("/", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    const service = await MessageService.SendMessage(req);
    return res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
});

// GetMessaages
MessageController.get("/:chatID", async (req:WriteLineRequest, res:Response, next:NextFunction)=>{
  try {
    const service = await MessageService.GetAllMessages(req);
    return res.status(200).json(service);
  }
  catch(err){
    next(err);
  }
});





export default MessageController;