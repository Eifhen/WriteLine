

import { useEffect, useState } from 'react';
import socketServer, { Socket } from 'socket.io-client';
import IUserDTO, { IUserImageDTO } from '../models/UserModel';
import { IChatModel } from '../models/ChatModel';
import objectIsNotEmpty from '../utils/object_helpers';
import { CHANNEL } from '../utils/channels.socket';
import HTTP from '../services/HttpService/HTTPService';



export interface IUseSocketServer {
  
  /**
    Ingresa el chat correspondiente a la conección socket
    @param {string} chatId
  */
  joinChat: (chatId: string) => void;

  /**
   Crea una constancia del chat en el que el usuario se encuentra
  */
  setChat: (chat: IChatModel) => void;
}

export default function useSocketServer(data:IUserDTO) : IUseSocketServer{
  const SERVER_URL =  import.meta.env.VITE_SERVER_BASE_URL;
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY= import.meta.env.VITE_WRITELINE_APIKEY;
  const API_KEY_HEADER= import.meta.env.VITE_API_KEY_HEADER;
  
  const [connected, setConnected] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState({} as IChatModel);
  
  const token = HTTP.GetToken();
  const socket = socketServer(SERVER_URL, {
    autoConnect: false,
  });

  if(token){
    socket.auth = { token };
    socket.connect();
  }

  const setChat = (chat: IChatModel) => {
    setSelectedChat(chat);
    console.log("chat =>", chat);
  }

  const joinChat = (chatId:string) => {
    socket.emit(CHANNEL.JoinChat, chatId);
  }

  useEffect(()=>{
    if(objectIsNotEmpty(data)){
      const userData:IUserDTO = {
        ...data,
        image: {} as  IUserImageDTO // no enviamos la imagen al server
      } 

      // Tan pronto como nos llega la data del usuario logeado, 
      // nos conectamos y creamos un chat con su id
      socket.emit(CHANNEL.CreateRoom, userData);
      
      // Este callback ocurre cuando enviamos un error desde el server
      socket.on(CHANNEL.Error, (err:any)=>{
        console.error("ha ocurrido un error =>", err);
      })

      // Este callback ocurre cuando sucede algún error de conección
      // por ejemplo: un error de autenticación.
      socket.on(CHANNEL.ConnectionError, (err) => {
        console.error(err);
      });

      // Este callback se llama cuando nos conectamos 
      // con exito al server
      socket.on(CHANNEL.Connection, ()=>{
        setConnected(true);
      })

      // Callback que se ejectua cuando cualquier socket es enviado
      // es util para realzar pruebas
      socket.onAny((event, ...args) => {
        console.log("Sockets => ",event, args);
      });
    }
  },[data]);

  return {
    joinChat,
    setChat,
  }
}