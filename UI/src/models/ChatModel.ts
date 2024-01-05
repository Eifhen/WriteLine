import IMessageModel from "./MessageModel";
import IUserDTO from "./UserModel";


export interface IChatModel {
  _id:string;
  name: string;
  isGroupChat: boolean;
  isActive:boolean;
  latestMessage?: IMessageModel;
  groupAdmin?: IUserDTO;
  creationDate: Date;
  users: IUserDTO[];
}


export interface IGroupChatDTO {
  idGroup?:string;
  name:string;
  idUsers: string[];
}