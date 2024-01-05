import { IChatModel, IGroupChatDTO } from "../../models/ChatModel";
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

  CreateGroupChat(data:IGroupChatDTO){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Post(`chats/group/create`, data)
      .then((res:any)=>{
        resolve(res.data as IChatModel);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }
  
  AddUsers(id:string, data:IGroupChatDTO){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Post(`chats/group/${id}/add-users`, data)
      .then((res:any)=>{
        resolve(res.data as IChatModel);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }

  RenameGroup(id:string, newName:string){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Post(`chats/group/rename/${id}/${newName}`)
      .then((res:any)=>{
        resolve(res.data as IChatModel);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }

  UpdateGroup(id:string, data:IGroupChatDTO){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Put(`chats/group/${id}`, data)
      .then((res:any)=>{
        resolve(res.data as IChatModel);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }

  DeleteGroup(id:string){
    return new Promise((resolve:(chat:IChatModel) => void, reject)=>{
      HTTP.Delete(`chats/group/${id}`)
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