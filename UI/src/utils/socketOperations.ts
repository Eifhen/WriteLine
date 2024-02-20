import { IChatModel } from "../models/ChatModel";
import IMessageModel from "../models/MessageModel";
import IUserDTO from "../models/UserModel";
import { CLIENT_CHANNEL, WriteLineSocket } from "./channels.socket";
import getUserDataWithoutImage from "./getUserDataWithoutImage";
import objectIsNotEmpty from "./object_helpers";

export type CallBack<T> = (msg: T) => void;

export interface IJoinChat {
  chatId:string;
  guid:string;
}

export interface IUserIsTyping {
  chatId:string;
  guid:string;
  isTyping:boolean;
}

export enum GroupChatOperations {
  ADD = "ADD",
  DELETE = "DELETE",
  UPDATE = "UPDATE"
}

export type TGroupChatOperations = "ADD" | "DELETE" | "UPDATE";

/**
  @param {WriteLineSocket} socket - instancia del socket a utilizar 
  @param {IJoinChat} joinChat - joinChat objecto con los datos del chat al cual se quiere unir
  @description permite al usuario logeado actual unirse a un determinado chat/room
*/
export const joinChat = (socket:WriteLineSocket, joinChat:IJoinChat) => {
  if(socket != null && socket != undefined){
    socket.emit(CLIENT_CHANNEL.JoinChat, joinChat);
  }
}

/**
  @param {WriteLineSocket} socket - instancia del socket a la cual se le enviará el mensaje
  @param {IMessageModel} message - objeto mensaje a enviar
  @description Emite un mensaje al canal al cual el usuario está conectado
*/
export const broatcastMessage = (socket:WriteLineSocket, message:IMessageModel) => {
  if(socket != null && socket != undefined){
    if(message.chat && message.chat.isGroupChat){
      // GroupChat Message
      socket.emit(CLIENT_CHANNEL.GroupMessage, message);
    }
    else {
      // SingleChat Message
      socket.emit(CLIENT_CHANNEL.NewMessage, message);
    }
  }
}

/**
  @param {WriteLineSocket} socket - instancia del socket en la cual se creará el room
  @param {IUserDTO} data - usuario logeado
  @description Crea un room con el guid del usuario logedo
*/
export const createRoom = (socket:WriteLineSocket, data:IUserDTO) => {
  console.log("create room =>", socket?.id, data?.guid);
  if(socket != null && socket != undefined && objectIsNotEmpty(data)){
    const userData = getUserDataWithoutImage(data);
    socket.emit(CLIENT_CHANNEL.CreateRoom, userData);
    console.log("room created");
  }
}

/**
  @param {WriteLineSocket} socket - Socket a enviar
  @param {selectedChatId} selectedChatId - room/chat a la cual se enviará el socket
  @param {String} currentUserID - guid del usuario que está escribiendo
  @param {any} typingTimer - variable que contrendrá el setTimeOut para fines de realizar el clearTimeout
  @param {number} timerLength - variable que contiene el tiempo de retrazo para la emisión del socket
  @description
  Emite un socket después de un determinado tiempo inidicando que el usuario dejó de escribirE 
*/
export const stopTypingInterval = (socket:WriteLineSocket, selectedChatId:string, currentUserGUID:string,typingTimer:any, timerLength:number) => {
  if(typingTimer != null){
    clearTimeout(typingTimer);
  }
  
  const lastTypingTime = new Date().getTime();
  typingTimer = setTimeout(()=>{
    const timeNow = new Date().getTime();
    const timeDifference = timeNow - lastTypingTime;
    if(timeDifference >= timerLength){
      socket.emit(CLIENT_CHANNEL.StopTyping, {
        isTyping: false,
        chatId: selectedChatId,
        guid: currentUserGUID,
      });
    }
  }, timerLength);
}

/** 
  @param {WriteLineSocket} socket - Socket a enviar
  @param {String} selectedChatId - room/chat a la cual se enviará el socket
  @param {String} currentUserID - guid del usuario que está escribiendo
  @param {Boolean} isTyping - variable que sirve para saber si el usuario se encuentra 
  escribiendo al momento de llamar al método
  @description
  Emite un socket al receptor inidicando que el usuario está escribiendo.
*/
export const emitUserIsTyping = (socket:WriteLineSocket, selectedChatId:string, currentUserGUID:string, isTyping:boolean) => {
  // 
  if(socket){
    if(isTyping){
      socket.emit(CLIENT_CHANNEL.Typing, {
        isTyping: true,
        chatId: selectedChatId,
        guid: currentUserGUID, 
      });
    }
    else {
      socket.emit(CLIENT_CHANNEL.StopTyping, {
        isTyping: false,
        chatId: selectedChatId,
        guid: currentUserGUID, 
      });
    }
  }
}

/**
 * 
 * @param {WriteLineSocket} socket - Socket a enviar 
 * @param {String} destinatarios - IDs/GUIDs de los destinatarios
 * @param {IChatModel} chat - chat con la información actualizada
 * @description - emite un socket a los usuarios destinatario con la información de un determinado chat actualizada
*/
export const emitUpdateGroupChat = (socket:WriteLineSocket, destinatarios: IUserDTO[], chat:IChatModel, operation:TGroupChatOperations) => {
  if(socket && destinatarios.length > 0){
    const ids = destinatarios.map(m => m.guid!);
    socket.emit(CLIENT_CHANNEL.UpdateGroup, ids, chat, operation);
  }
}
