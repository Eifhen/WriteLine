

export interface IJoinedChats {
  [key:string]: IJoinChat[];
}

export interface IJoinChat {
  chatId:string;
  guid:string;
}

export interface IUserIsTyping {
  chatId:string;
  guid:string;
  isTyping:boolean;
}

export enum GroupChatOperations {
  ADD = "ADD",
  DELETE = "DELETE",
  UPDATE = "UPDATE"
}

export type TGroupChatOperations = "ADD" | "DELETE" | "UPDATE";

export interface IChannelManager {
  /** Array que registra los rooms en los cuales cada connección se encuentra subscrito*/
  JOINED_CHATS: IJoinedChats,

  /** Función que sirve para validar una conección antes de subscribirla a un room */
  ValidateBeforeJoinToRoom: (
    connection_id: string, 
    room: string, 
    guid: string, 
    isCreating:boolean, 
    callback: () => void
  ) => void;

  /** Obtiene todas las rooms a las cuales un determinado usuario está conectado */
  GetRoomsByGUID: (user_guid: string) => any;

  /** Obtiene un array de todas las conecciones  */
  GetCurrentConnections: () => string[];
  
  /** Agrega la conección al array de conecciones */
  AddCurrentConnection: (connection_id: string) => void
}

export default function ChannelManager() : IChannelManager{
  
  const JOINED_CHATS:IJoinedChats = {}; 


  const AddCurrentConnection = (connection_id:string) => {
    // Si el objeto en el key está vacío entonces agregamos un array vacío
    if(!JOINED_CHATS[connection_id]){
      JOINED_CHATS[connection_id] = [];
    }
  }

  const ValidateBeforeJoinToRoom = (
    connection_id:string, 
    room:string, 
    guid:string, 
    isCreating:boolean, 
    callback: () => void
  ) => {
    // verifica si la conección actul se encuentra subscrita 
    // a un determinado room/chat
    if(JOINED_CHATS[connection_id] && JOINED_CHATS[connection_id].find((m)=> m.chatId === room)){
      if(isCreating){
        console.log(`User ${guid} #${connection_id} has already created this room/chat ${room}`)
      }
      else {
        console.log(`User ${guid} #${connection_id} is already joined to room/chat ${room}`);
      }
    }
    else {
      // Si el objeto en el key está vacío entonces agregamos un array vacío
      if(!JOINED_CHATS[connection_id]){
        JOINED_CHATS[connection_id] = [];
      }

      JOINED_CHATS[connection_id].push({
        guid,
        chatId: room
      });
      
      //console.log("JOINED_CHATS =>",JOINED_CHATS);
      // tras estas condiciones permite al usuario logeado conectarse con un room
      // lo que le va a permitir emitir mensajes a dicho room
      callback();
    }
  }

  const GetCurrentConnections = () => {
    return Object.keys(JOINED_CHATS);
  }

  const GetRoomsByGUID = (user_guid:string) => {
    const transformedObject:any = {};

    // Iterar sobre el objeto original
    for (const userId in JOINED_CHATS) {
        // Obtener el array de chatIds para este userId
        const chatIdArray = JOINED_CHATS[userId];

        // Iterar sobre cada entrada del array de chatIds
        chatIdArray.forEach(entry => {
            // Obtener el guid y chatId
            const { guid, chatId } = entry;
            if(guid === user_guid){
              // Si ya existe una entrada para este guid, agregamos el chatId al array existente
              if (transformedObject[guid]) {
                  transformedObject[guid].push(chatId);
              } else {
                  // Si no existe una entrada para este guid, creamos un nuevo array con el chatId
                  transformedObject[guid] = [chatId];
              }
            }

        });
    }

    return transformedObject;
  } 

  return {
    JOINED_CHATS,
    ValidateBeforeJoinToRoom,
    GetRoomsByGUID,
    GetCurrentConnections,
    AddCurrentConnection
  }
}