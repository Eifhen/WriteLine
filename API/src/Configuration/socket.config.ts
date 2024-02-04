

import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as SocketServer } from "socket.io";
import { ConsoleBlue } from "../Utilis/consoleColor";
import { ErrorHandler } from "./error.handler.config";
import IUserDTO, { validateUserDTO } from "../DTO/user.dto";
import IMessageModel from "../Models/message.model";
import { CodigoHTTP } from "../Utilis/codigosHttp";
import { objectIsNotEmpty } from "../Utilis/isEmpty";
import { CHANNEL } from "../Utilis/channels.sockets";
import { JwtPayload } from "jsonwebtoken";
import { DecodeJWToken } from "../Utilis/token";
import IUserModel, { UserModel } from "../Models/user.model";


type SockerManager = Server<typeof IncomingMessage, typeof ServerResponse>;

export default function SocketManager(httpServer: SockerManager){
    
  const socketServer = new SocketServer(httpServer, {
    pingTimeout:60000,
    cors: { origin: "*" }
  });

  // Socket Autentication
  socketServer.use(async (socket:any, next)=>{
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
            console.log("Socket connection autenticated");
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

  socketServer.on(CHANNEL.Connection, (socket:any) =>{
    ConsoleBlue(`Connected to socket.io => ${socket.id}`);
  
    // Crea un roon [SingleChat]
    socket.on(CHANNEL.CreateRoom, (userData:IUserDTO)=>{
      try {
        const { isValid, errors } = validateUserDTO(userData);
        if (isValid) {
          // crea un roon con el id del usuario logeado
          const room = userData._id.toString();
          socket.join(room);
          socket.emit('your room has been created');
        } else {
          // Lanza un nuevo error
          throw ErrorHandler(CodigoHTTP.BadRequest, errors);
        }
      } catch (err:any) {
        console.error("error al crear el room =>", err.message, __filename);
        socket.emit(CHANNEL.Error, err.message); // Emite el error al cliente
      }
    });

    // Join a chat 
    socket.on(CHANNEL.JoinChat, (id_room:string)=>{
      try {
        // permite al usuario logeado conectarse con un room
        // lo que le va a permitir emitir mensajes a dicho room
        socket.join(id_room);
        console.log("user joined room", id_room);
      }
      catch(err:any){
        console.error("error al unirse al chat =>", err.message, __filename);
        socket.emit(CHANNEL.Error, err.message);
      }
    });

    // new Message [SingleChat] 
    socket.on(CHANNEL.NewMessage, (message:IMessageModel) => {
      try {
        const chat = message.chat;
        if(chat && chat.users && message.sender){
          chat.users.forEach(user => {
            // si el usuario es distinto al emisor del mensaje
            // entonces envía un mensaje al usuario destinatario
            const destinatario = user._id.toString();
            const emisor = message.sender?._id.toString();
            if(destinatario && emisor && destinatario != emisor){
              socket.to(destinatario).emit(CHANNEL.MessageRecieved, message);
            } 
          })
        }
        else {
          throw ErrorHandler(
            CodigoHTTP.BadRequest, 
            "Error al enviar el mensaje", 
          );
        }
      }
      catch(err:any){
        console.error("error al enviar mensaje =>", err.message, __filename);
        socket.emit(CHANNEL.Error, err.message);
      }
    })

    socket.on(CHANNEL.Desconecting, () => {
      console.log("Disconnecting  | sockets rooms =>", socket.rooms);
    });
  
    socket.on(CHANNEL.Disconnect, () => {
      console.log("Disconected | sockets size => ", socket.rooms.size)
    });

  });
}