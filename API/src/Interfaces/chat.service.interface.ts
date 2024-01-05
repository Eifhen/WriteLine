import { IResponseHandler } from "../Configuration/response.handler.config";
import IGroupChatDTO from "../DTO/group.chat.dto";
import { IChatModel } from "../Models/chat.model";
import IUserModel from "../Models/user.model";
import WriteLineRequest from "./auth.request.interface";





export default interface IChatService {
  AccessChat:(req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  GetAllChats:(req:WriteLineRequest) => Promise<IResponseHandler<IChatModel[]>>;
  CreateGroupChat:(req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  AccessGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  RenameGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  AddUsersToGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  RemoveUsersFromGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  GetAllActiveChats:(req:WriteLineRequest) => Promise<IResponseHandler<IChatModel[]>>;
  UpdateGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;
  DeleteGroupChat: (req:WriteLineRequest) => Promise<IResponseHandler<IChatModel>>;

  
}