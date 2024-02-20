import { useEffect } from "react";
import ChatService from "../services/ChatService/chat.service";
import notify from "../utils/notify";
import { IChatModel } from "../models/ChatModel";


export default function useActiveChats(callback:(response:IChatModel[])=> void, dependencies?:any[]){
  useEffect(()=>{
    ChatService.GetActiveChats()
    .then((res)=>{
      callback(res);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err.message;
    })
  }, dependencies);
}