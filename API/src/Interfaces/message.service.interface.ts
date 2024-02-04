import { IResponseHandler } from "../Configuration/response.handler.config";
import IMessageModel from "../Models/message.model";
import WriteLineRequest from "./auth.request.interface";






export default interface IMessageService {
  SendMessage:(req:WriteLineRequest) => Promise<IResponseHandler<IMessageModel>>;
  GetAllMessages:(req:WriteLineRequest) => Promise<IResponseHandler<IMessageModel[]>>;

}