import { IResponseHandler } from "../Configuration/response.handler.config";
import ILoginModel from "../Models/login.model";

export default interface ISignInService {
  
  Login(data:ILoginModel): IResponseHandler<string>;
}