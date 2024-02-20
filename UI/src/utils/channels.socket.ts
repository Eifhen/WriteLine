import { Socket } from "socket.io-client";
import IMessageModel from "../models/MessageModel";
import IUserDTO from "../models/UserModel";
import { IJoinChat, IUserIsTyping, TGroupChatOperations } from "./socketOperations";
import { IChatModel } from "../models/ChatModel";

export enum CLIENT_CHANNEL {
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

// Interfaz de los eventos que se reciben del server
export interface IServerToClientEvents {
  "message-recieved" : (message:IMessageModel) => void; // listener event
  "typing": (data:IUserIsTyping) => void; // listener event
  "stop-typing": (data:IUserIsTyping) => void; // listener event
  "updated-group": (destinatario:string, data:IChatModel, operation:TGroupChatOperations) => void; // listener event

  "connection": (data:any) => void; // listener event
  'connected': (data:any) => void;  // listener event
  'connect_error': (error:any) => void; // listener event

  'disconnecting': (data:any) => void; // listener event
  'disconnect': (data:any) => void; // listener event
  
  'error': (error:any) => void; // listener event
  [key:string] : any;
}

// Interfaz de los eventos que se envian al server
export interface IClientToServerEvents {
  "create-room": (data:IUserDTO) => void;  // emit event
  "join-chat": (data:IJoinChat) => void; // emit event
  "new-message": (message:IMessageModel)=> void; // emit event
  "group-message": (message:IMessageModel)=> void; // emit event
  "typing" : (data:IUserIsTyping) => void // emit event
  "stop-typing" : (data:IUserIsTyping) => void // emit event
  "update-group": (destinatario:string[], data:IChatModel, operation:TGroupChatOperations) => void; // emit event
}

export type WriteLineSocket = Socket<IServerToClientEvents, IClientToServerEvents>;