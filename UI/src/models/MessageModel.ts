import { IChatModel } from "./ChatModel";
import IUserDTO from "./UserModel";

export default interface IMessageModel {
  sender: IUserDTO;
  content: string;
  chat: IChatModel;
  date: Date;
}