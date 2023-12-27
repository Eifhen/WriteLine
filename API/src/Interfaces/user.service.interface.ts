import IUserModel from "../Models/user.model";
import { IResponseHandler } from "../Configuration/response.handler.config";
import WriteLineRequest from "./auth.request.interface";
import IUserDTO from "../DTO/user.dto";


export default interface IUserService {
  GetAllUsers(request:WriteLineRequest): Promise<IResponseHandler<IUserModel[]>>;
  GetUsersByQuery(request:WriteLineRequest): Promise<IResponseHandler<IUserDTO[]>>;
  GetUser(id:string):  Promise<IResponseHandler<IUserDTO>>;
  GetUsersById(ids:string[]) : Promise<IUserModel[]>;
  AddUser(user:IUserModel) : Promise<IResponseHandler<IUserModel>>;
  UpdateUser(id:string, user:IUserModel) :  Promise<IResponseHandler<IUserModel>>;
  DeleteUser(id:string): Promise<IResponseHandler<IUserModel>>;
  GetUserImage(id:string): Promise<IResponseHandler<string>>;
}