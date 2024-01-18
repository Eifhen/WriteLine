import { useEffect } from "react";
import IMessageModel from "../models/MessageModel";
import MessageService from '../services/MessageService/message.service';
import notify from "../utils/notify";



export default function useAllMessages(
  condition:boolean, 
  idChat:string, 
  callback:(data:IMessageModel[])=> void, 
  dependencies: any[]
){

  useEffect(()=>{
    if(condition){
      MessageService.GetAllMessages(idChat)
      .then((res)=> {
        callback(res);
      })
      .catch((err)=>{
        notify(err.message,"error");
        throw err;
      })
    }
  }, dependencies);
}