

import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as SocketServer } from "socket.io";
import { ConsoleBlue } from "../Utilis/consoleColor";
import { ErrorHandler } from "./error.handler.config";
import IUserDTO, { validateUserDTO } from "../DTO/user.dto";
import IMessageModel from "../Models/message.model";
import { CodigoHTTP } from "../Utilis/codigosHttp";
import { SERVER_CHANNEL, IClientToServerEvents, IServerToClientEvents } from "../Utilis/channels.sockets";
import { JwtPayload } from "jsonwebtoken";
import { DecodeJWToken } from "../Utilis/token";
import IUserModel, { UserModel } from "../Models/user.model";
import ChannelManager, { IJoinChat, IUserIsTyping, TGroupChatOperations } from "../Utilis/channles.manager";
import { IChatModel } from "../Models/chat.model";


type SockerManager = Server<typeof IncomingMessage, typeof ServerResponse>;


export default function SocketManager(httpServer: SockerManager){
    
  const { 
    JOINED_CHATS,
    ValidateBeforeJoinToRoom, 
    GetRoomsByGUID, 
    GetCurrentConnections, 
    AddCurrentConnection,
  } = ChannelManager();

  const io = new SocketServer<IClientToServerEvents, IServerToClientEvents>(httpServer, {
    pingTimeout:60000,
    cors: { origin: "*" }
  });

  // Socket Autentication
  io.use(async (socket:any, next)=>{
    try {
      const token = socket.handshake.auth.token;
      if(token){
        const decode = DecodeJWToken(token) as JwtPayload;
       
        if(decode){
          // validar que el usuario exista;
          const guid = decode.data.guid;
          const currentUser:IUserModel | null = await UserModel.findOne({guid});
          if(currentUser){
            socket.currentUser = currentUser;
            socket.decodedToken = decode;
            //console.log("Socket connection autenticated");
            return next();
          }
          throw ErrorHandler(CodigoHTTP.Unauthorized, "Usuario Invalido", __filename);
        }
      }
      else {
        throw ErrorHandler(
          CodigoHTTP.Forbidden, 
          'Error al autenticar la conección socket', 
          __filename
        );
      }
    }
    catch(err:any){
      console.error("error al autenticar el socket", __filename);
      next(err);
    }
  })

  io.on(SERVER_CHANNEL.Connection, (socket) =>{
    ConsoleBlue(`Connected to socket.io => ${socket.id}`);
    AddCurrentConnection(socket.id);
    
    console.log("Connected | current connections =>", GetCurrentConnections());

    // Crea un roon [SingleChat]
    socket.on(SERVER_CHANNEL.CreateRoom, async (userData:IUserDTO)=>{
      try {
        const { isValid, errors } = validateUserDTO(userData);
        if (isValid) {
          // crea un roon con el id del usuario logeado
          const room = userData.guid;
          const connection_id = socket.id;
          
          ValidateBeforeJoinToRoom(connection_id, room, room, true, ()=>{
            socket.join(room);
            socket.emit(SERVER_CHANNEL.Connection, `room ${room} has been created`);
            console.log(`the user ${room} # ${connection_id} has created the room ${room}`);
          })
 
        } else {
          // Lanza un nuevo error
          throw ErrorHandler(CodigoHTTP.BadRequest, errors);
        }
      } catch (err:any) {
        console.error("error al crear el room =>", err.message, __filename);
        socket.emit(SERVER_CHANNEL.Error, err.message); // Emite el error al cliente
      }
    });

    // Join a chat 
    socket.on(SERVER_CHANNEL.JoinChat, (data:IJoinChat)=>{
      try {
        const connection_id = socket.id;
        ValidateBeforeJoinToRoom(connection_id, data.chatId, data.guid, false, ()=> {
          socket.join(data.chatId);
          console.log(`user ${data.guid} #${connection_id} has joined the room/chat ${data.chatId}`);
          console.log(`the current joined rooms of the user ${data.guid} are`, GetRoomsByGUID(data.guid));
        })
      }
      catch(err:any){
        console.error("error al unirse al chat =>", err.message, __filename);
        socket.emit(SERVER_CHANNEL.Error, err.message);
      }
    });

    // new Message [SingleChat] 
    socket.on(SERVER_CHANNEL.NewMessage, (message:IMessageModel) => {
      try {
        const chat = message.chat;
        if(chat && chat.users && message.sender && !message.chat?.isGroupChat){
          chat.users.forEach(user => {
            // si el usuario es distinto al emisor del mensaje
            // entonces envía un mensaje al usuario destinatario
            const destinatario = user.guid;
            const emisor = message.sender?.guid;
            if(destinatario && emisor && destinatario != emisor){
              console.log("destinatario =>", GetRoomsByGUID(destinatario));
              console.log("current connections =>", GetCurrentConnections());
              socket.to(destinatario).emit(SERVER_CHANNEL.MessageRecieved, message);
            } 
          })
        }
        else {
          throw ErrorHandler(
            CodigoHTTP.BadRequest, 
            "Error al enviar el mensaje", 
            "socket.config/socket.on/new-message"
          );
        }
      }
      catch(err:any){
        console.error(err.message, err.path);
        socket.emit(SERVER_CHANNEL.Error, err.message);
      }
    })

    // new Message [GroupChat]
    socket.on(SERVER_CHANNEL.GroupMessage, (message:IMessageModel)=>{
      try {
        const chatID = message.chat?._id;
        if(chatID){
          const id = chatID.toString();
          socket.to(id).emit(SERVER_CHANNEL.MessageRecieved, message);
        }
      }
      catch(err){
        throw ErrorHandler(
          CodigoHTTP.BadRequest, 
          "Error al enviar el mensaje", 
          "socket.config/socket.on/group-message"
        );
      }
    })

    // UpdateGroup
    socket.on(SERVER_CHANNEL.UpdateGroup, (destinatarios:string[], chat:IChatModel, operation:TGroupChatOperations) => {
      try {
        destinatarios.map(destinatario => {
          socket.to(destinatario).emit(SERVER_CHANNEL.UpdatedGroup, destinatario, chat, operation);
        })
      }
      catch {
        throw ErrorHandler(
          CodigoHTTP.BadRequest, 
          "Error al actualizar el chat", 
          "socket.config/socket.on/update-group"
        );
      }
    })

    // Some user is typing in a room/chat
    socket.on(SERVER_CHANNEL.Typing, (data:IUserIsTyping)=>{
      socket.to(data.chatId).emit(SERVER_CHANNEL.Typing, {
        isTyping:true,
        guid: data.guid,
        chatId: data.chatId,
      });
    });

    socket.on(SERVER_CHANNEL.StopTyping, (data:IUserIsTyping)=>{
      socket.to(data.chatId).emit(SERVER_CHANNEL.Typing, {
        isTyping:false,
        guid: data.guid,
        chatId: data.chatId,
      });
    })

    socket.on(SERVER_CHANNEL.Desconecting, () => {
      //console.log("Disconnecting  | sockets rooms =>", socket.rooms);
    });
  
    socket.on(SERVER_CHANNEL.Disconnect, () => {
      const connection_id = socket.id;
      // Elimina al usuario de todos los rooms/chats cuando se desconecta
      if(JOINED_CHATS[connection_id]){
        JOINED_CHATS[connection_id].forEach((data)=>{
          socket.leave(data.chatId);
          console.log(`The user ${data.guid} #${connection_id} has desconected from the chat ${data.chatId}`);
        });
        // removemos el usuario del objeto que lista las conecciones
        delete JOINED_CHATS[connection_id]; 
      } 
      console.log("Disconected | remaining chats => ", JOINED_CHATS);
      console.log("Disconected | remaining connections =>", GetCurrentConnections());
    });

  });
}