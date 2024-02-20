import { useEffect } from "react";
import { CLIENT_CHANNEL, WriteLineSocket } from "../utils/channels.socket";
import { IChatModel } from "../models/ChatModel";
import { TGroupChatOperations } from "../utils/socketOperations";




type OnChatUpdatedCallback = (destinatario:string, updatedChat:IChatModel, operation:TGroupChatOperations) => void;

export default function useOnChatIsUpdated(socket:WriteLineSocket, callback:OnChatUpdatedCallback, dependencies:any[]){
  useEffect(()=>{
    const handleCallback = (destinatario:string, updatedChat:IChatModel, operation:TGroupChatOperations) => {
      callback(destinatario, updatedChat, operation);
    }

    if(socket){
      socket.on(CLIENT_CHANNEL.UpdatedGroup, handleCallback);
    }

    return () => {
      if(socket){
        socket.off(CLIENT_CHANNEL.UpdatedGroup, handleCallback);
      }
    }
  }, dependencies)
}