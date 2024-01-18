import IMessageModel, { IMessageDTO } from '../../models/MessageModel';
import HTTP from '../HttpService/HTTPService';

class MessageServices {

  SendMessage(msg:IMessageDTO){
    return new Promise<IMessageModel>((resolve, reject)=>{
      return HTTP.Post("/messages/", msg)
      .then((res:any)=> {
        resolve(res.data as IMessageModel);
      })
      .catch((err)=>{
        reject(err);
      })
    })
  }

  GetAllMessages(chatID:string){
    return new Promise<IMessageModel[]>((resolve, reject)=>{
      return HTTP.Get(`/messages/${chatID}`)
      .then((res:any)=>{
        resolve(res.data as IMessageModel[]);
      })
      .catch((err)=>{
        reject(err);
      });
    })
  }

}

const MessageService = new MessageServices();
export default MessageService;