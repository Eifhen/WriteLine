import { Socket } from "socket.io";
import IMessageModel from "../Models/message.model";
import IUserDTO from "../DTO/user.dto";
import { IJoinChat, IUserIsTyping, TGroupChatOperations } from "./channles.manager";
import { IChatModel } from "../Models/chat.model";



/**
 @description
 Registro de todos los canales de sockets 
 que estamos utilizando
*/
export enum SERVER_CHANNEL {
  CreateRoom = 'create-room',
  JoinChat = 'join-chat',
  
  NewMessage = 'new-message',
  MessageRecieved = 'message-recieved',
  GroupMessage = 'group-message',

  
  UpdateGroup = 'update-group',
  UpdatedGroup = 'updated-group',

  Typing = 'typing',
  StopTyping = 'stop-typing',

  Connection = 'connection',
  Connected = 'connected',
  ConnectionError = 'connect_error',  
  
  Desconecting = 'disconnecting',
  Disconnect = 'disconnect',
  Error = 'error',
}


/**
  @description 
  Interfaz de los eventos que se envian al cliente
  la lógica aquí es lo contrario a la lógica de su contraparte 
  en el cliente 
*/
export interface IServerToClientEvents {
  "message-recieved" : (message:IMessageModel) => void; // emit event
  "typing" : (data:IUserIsTyping) => void;  // emit event
  "stop-typing" : (data:IUserIsTyping) => void;  // emit event

  "updated-group" : (destinatario:string, data:IChatModel, operation:TGroupChatOperations) => void;  // emit event
  
  "connection": (data:any) => void; // emit event
  'connected': (data:any) => void;  // emit event
  'connect_error': (error:any) => void; // emit event

  'disconnecting': (data:any) => void; // emit event
  'disconnect': (data:any) => void; // emit event
  
  'error': (error:any) => void; // emit event
  [key:string] : any;
}

/**  
 @description 
 Interfaz de los eventos que se reciben desde el cliente 
 la lógica aquí es lo contrario a la lógica de su contraparte 
 en el cliente
*/
export interface IClientToServerEvents {
  "create-room": (data:IUserDTO) => void;  // listener event
  "join-chat": (data:IJoinChat) => void; //  listener event
  "new-message": (message:IMessageModel)=> void; // listener event
  "group-message": (message:IMessageModel) => void;
  "typing" : (data:IUserIsTyping) => void // listener event;
  'stop-typing' : (data:IUserIsTyping) => void; // listener event;
  "update-group" : (destinatario:string[], data:IChatModel, operation:TGroupChatOperations) => void; // listener event;
}



