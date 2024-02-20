import { useEffect } from "react";
import IMessageModel from "../models/MessageModel";
import { CLIENT_CHANNEL, WriteLineSocket } from "../utils/channels.socket";
import { CallBack } from "../utils/socketOperations";

/**
  @param {WriteLineSocket} socket - instancia del socket al cual se subscribirá
  @param {CallBack} callback - callback a ejecutar cuando se reciba un mensaje
  @description -se subscribe para recibir cualquier mensaje enviado al usuario actual y 
  ejecuta un callback cuando se recibe un mensaje
*/
export const useOnMessageReceived = (socket:WriteLineSocket, callback: CallBack<IMessageModel>, dependencies:any) => {
  useEffect(()=>{
    // esto se hace para poder desubscribir mediante la ejecución
    // de la función cleanup
    const handleCallback = (received:IMessageModel) => {
      callback(received);
    }

    if(socket != null && socket != undefined){
      socket.on(CLIENT_CHANNEL.MessageRecieved, handleCallback);
    }

    return () => {
      if(socket != null && socket != undefined){
        socket.off(CLIENT_CHANNEL.MessageRecieved, handleCallback);
      }
    }
  },[dependencies]);
}