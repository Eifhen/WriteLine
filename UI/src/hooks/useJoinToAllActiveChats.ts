import { useEffect } from "react";
import { IChatModel } from "../models/ChatModel";
import { CLIENT_CHANNEL, WriteLineSocket } from "../utils/channels.socket";



/** 
  @param {WriteLineSocket} socket -  instancia del socket a utilizar 
  @param {String} currentUserGUID - guid del usuario logeado
  @param {IChatModel[]} chats - chats activos
  @description hook que sirve para conectar automáticamente al usuario logeado a la lista de chats activos
*/
export default function useJoinToAllActiveChats(socket:WriteLineSocket, currentUserGUID:string, chats:IChatModel[]){
  useEffect(()=>{
    if(socket && currentUserGUID && chats.length > 0){
      chats.forEach(chat => {
        socket.emit(CLIENT_CHANNEL.JoinChat, {
          chatId: chat._id,
          guid: currentUserGUID
        });
      })
    }
  },[chats, socket, currentUserGUID]);
}