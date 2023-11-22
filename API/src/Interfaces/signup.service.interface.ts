


// IResponseHandler

import IUserModel from "../Models/user.model";
import { IResponseHandler } from "../Configuration/response.handler.config";

export default interface ISignUpService {
  
  Register(data:IUserModel): IResponseHandler<IUserModel>;
}