import { IChatModel } from "./ChatModel";
import IUserDTO from "./UserModel";

export default interface IMessageModel {
  sender: IUserDTO;
  content: string;
  chat: IChatModel;
  date: Date;
}

export interface IMessageDTO {
  idChat:string;
  message:string;
}