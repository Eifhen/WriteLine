

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { CLIENT_CHANNEL, WriteLineSocket } from '../utils/channels.socket';
import HTTP from '../services/HttpService/HTTPService';


export function useCreateSocketServer(callback:(socket:any)=>void){
  const SERVER_URL =  import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(()=>{
    const token = HTTP.GetToken();
    const newSocket:WriteLineSocket = io(SERVER_URL, {
      autoConnect: false,
    });
    
    if(token){
      newSocket.auth = { token };
      newSocket.connect();
      console.log("created socket =>", newSocket.id);
    }

    const connectHandler = () => {
      console.log("connected");
    };

    const connectionErrorHandler = (err: any) => {
      console.error("Error al conectar =>", err);
    };

    const errorHandler = (err: any) => {
      console.error("ha ocurrido un error =>", err);
    };

    newSocket.on(CLIENT_CHANNEL.Connection, connectHandler);
    newSocket.on(CLIENT_CHANNEL.ConnectionError, connectionErrorHandler);
    newSocket.on(CLIENT_CHANNEL.Error, errorHandler);

    callback(newSocket);

    // cleanup
    return () => {
      newSocket.off(CLIENT_CHANNEL.Connection, connectHandler);
      newSocket.off(CLIENT_CHANNEL.ConnectionError, errorHandler);
      newSocket.off(CLIENT_CHANNEL.Error, errorHandler);

      if (newSocket) {
         // Desconectamos el socket al desmontar
        newSocket.disconnect();
        //console.log("hook unmounts =>", newSocket.id);
      }
    };
  },[]);
}