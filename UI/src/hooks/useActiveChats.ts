import { useEffect } from "react";
import ChatService from "../services/ChatService/chat.service";
import notify from "../utils/notify";


export default function useActiveChats(callback:(response:any)=> void, dependencies?:any[]){
  useEffect(()=>{
    ChatService.GetActiveChats()
    .then((res:any)=>{
      callback(res.data);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err.message;
    })
  }, dependencies);
}