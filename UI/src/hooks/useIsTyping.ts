import { useEffect } from "react";
import { CLIENT_CHANNEL, WriteLineSocket } from "../utils/channels.socket";
import { IUserIsTyping } from "../utils/socketOperations";




export default function useIsTyping(socket:WriteLineSocket, callback:(data:IUserIsTyping)=>void, dependencies:any[]){
  useEffect(()=>{

    // esto se hace para poder desubscribir mediante la ejecución
    // de la función cleanup
    const handleCallback = (data:IUserIsTyping) => {
      callback(data);
    }

    if(socket != null && socket != undefined){
      socket.on(CLIENT_CHANNEL.Typing, handleCallback);
    }

    return () => {
      if(socket != null && socket != undefined){
        socket.off(CLIENT_CHANNEL.Typing, handleCallback);
      }
    }
  }, dependencies);
}