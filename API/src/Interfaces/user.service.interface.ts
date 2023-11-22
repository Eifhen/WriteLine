import IUserModel from "../Models/user.model";
import { IResponseHandler } from "../Configuration/response.handler.config";


export default interface IUserService {
  GetUsers(): IResponseHandler<IUserModel[]>;
  GetUser(id:string):  IResponseHandler<IUserModel>;
  AddUser(user:IUserModel) : IResponseHandler<IUserModel>;
  UpdateUser(id:string, user:IUserModel) : IResponseHandler<IUserModel>;
  DeleteUser(id:string): IResponseHandler<IUserModel[]>;
}