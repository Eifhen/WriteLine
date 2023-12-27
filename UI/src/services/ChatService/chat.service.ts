import { IChatModel } from "../../models/ChatModel";
import HTTP from "../HttpService/HTTPService";

class ChatServices {

  GetActiveChats(){
    return new Promise((resolve, reject)=>{
      HTTP.Get(`/chats/actives`)
      .then((res)=>{
        resolve(res);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }

  AccessChat(id:string){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Get(`chats/access/${id}`)
      .then((res:any)=>{
        resolve(res.data as IChatModel);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }
  
}

const ChatService = new ChatServices();
export default ChatService;