import { IChatModel } from "../Models/chat.model";




/**
  Este método sirve para ordenar los usuarios que existen en una lista
  de chats, la idea es que el primer usuario de cada chat sea el admin
  @param chats - IChatModel[]
  @return IChatModel[] - Arreglo de chats con los usuarios ordenados por admin
*/
export default function OrderChatsUsers(chats:IChatModel[]) : IChatModel[]{
  return chats.map(chat => {
    const admin = chat.groupAdmin?.id;
    if(admin && chat.isGroupChat){
      const adminIndex = chat.users.findIndex(m => m._id.equals(admin));
      if(adminIndex !== -1){
        const adminUser = chat.users.splice(adminIndex, 1)[0];
        chat.users.unshift(adminUser);
      }
    }
    return chat;
  })
}

/**
  Este método sirve para ordenar por admin los usuarios que 
  existen en un chat expecifico 
  
  @params chat - IChatModel
  @return IChatModel - Chat con los usuarios ordenados por admin
 */
export function OrderUsers(chat:IChatModel) : IChatModel {
  const admin = chat.groupAdmin?.id;
  if(admin && chat.isGroupChat){
    const adminIndex = chat.users.findIndex(m => m._id.equals(admin));
    if(adminIndex !== -1){
      const adminUser = chat.users.splice(adminIndex, 1)[0];
      chat.users.unshift(adminUser);
    }
  }
  return chat;
}

