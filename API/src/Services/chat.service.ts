import { Types } from "mongoose";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from '../Configuration/response.handler.config';
import IGroupChatDTO, { validateGroupChatDTO } from "../DTO/group.chat.dto";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import IChatService from "../Interfaces/chat.service.interface";
import { ChatModel, IChatModel } from "../Models/chat.model";
import IUserModel, { UserModel } from "../Models/user.model";
import { CodigoHTTP, MensajeHTTP } from '../Utilis/codigosHttp';
import UserServices from "./user.service";




class ChatServices implements IChatService {

  /**
    Esta función crea la sala de chat entre el usuario logeado 
    y un destinatario
  */
  async AccessChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>>{
    try {
      const current:IUserModel  = req.currentUser!;
      const id_destinatario:string = req.params.id;
      const destinatario:IUserModel | null = await UserModel.findById(id_destinatario).lean().exec();
    
      if(destinatario){
  
        const isChat = await ChatModel.find({
          isGroupChat:false, 
          $and: [
            {users: { $elemMatch: {$eq: current._id }}},
            {users: { $elemMatch: {$eq: id_destinatario }}}
          ]
        })
        .populate("users","-password")
        .populate({
          path: "latestMessage",
          populate: { path: "sender" }
        })
      
        if(isChat.length > 0){
          return ResponseHandler<IChatModel>(isChat[0], MensajeHTTP.OK);
        }
        else {
          // si el chat no existe crea uno nuevo
          const newChat:IChatModel = {
            name: `${destinatario.nombre} ${destinatario.apellido}`,
            isGroupChat: false,
            isActive:true,
            creationDate: new Date(),
            users: [current, destinatario]
          }
  
          const createdChat = await ChatModel.create(newChat);
  
          // devuelve el chat con el array de usuarios cargado
          const fullChat:IChatModel | null = await ChatModel
          .findOne({_id: createdChat._id})
          .populate("users","-password") // carga el array de usuarios pero excluye la columna password
          .lean().exec();
  
          return ResponseHandler<IChatModel>(fullChat!, MensajeHTTP.Created);
        }
      }

      throw ErrorHandler(CodigoHTTP.NotFound, MensajeHTTP.NotFound, __filename);
    }
    catch(err){
      throw ErrorHandler(CodigoHTTP.BadRequest, MensajeHTTP.BadRequest, __filename);
    }
  }

  async GetAllChats(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel[]>>{
    try {
      const current:IUserModel = req.currentUser!;
      const chats:IChatModel[] = await ChatModel.find({
        users: { $elemMatch: { $eq: current._id }}
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({updatedAt: -1})

      await UserModel.populate(chats, {
        path: "latestMessage.sender",
        select: "nombre image email"
      });

      return ResponseHandler<IChatModel[]>(chats, MensajeHTTP.OK);
    }
    catch(err){
      throw ErrorHandler(CodigoHTTP.BadRequest, MensajeHTTP.BadRequest, __filename);
    }
  }

  async CreateGroupChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>> {
    try {
      const group:IGroupChatDTO = req.body;
      const { isValid, errors } = validateGroupChatDTO(group);
      if(isValid){
        if(group.idUsers.length >= 2){
          // agregamos el usuario logeado a la lista de usuarios del grupo
          group.idUsers.push(req.currentUser!._id.toString());
          const users:IUserModel[] = await UserServices.GetUsersById(group.idUsers);

          const createdGroup = await ChatModel.create({
            name: group.name,
            isGroupChat: true,
            isActive: true,
            groupAdmin: req.currentUser,
            creationDate: new Date(),
            users: users
          } as IChatModel)
         
          await createdGroup.populate('users', "-password");
          await createdGroup.populate("groupAdmin","-password");
          
          return ResponseHandler<IChatModel>(createdGroup, MensajeHTTP.Created);
        }

        throw ErrorHandler(CodigoHTTP.InternalServerError, "El chat no tiene participantes suficientes", __filename);
      }
      
      throw ErrorHandler(CodigoHTTP.InternalServerError, errors, __filename);
    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path)
    }
  }

  async RenameGroupChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>>{
    try {
      const { id, newName } = req.params;
      const find = await ChatModel.findOne({_id:id}).where({isGroupChat:true});  
      if(find){
        find.name = newName;
        const updatedChat = await find.save(); 
        
        await updatedChat.populate("users", "-password");
        await updatedChat.populate("groupAdmin","-password");

        return ResponseHandler<IChatModel>(updatedChat, MensajeHTTP.OK);
      }
      throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
    }
    
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path)
    }
  }

  async AccessGroupChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>>{
    try {
      const idChat = req.params.id!;
      const chat= await ChatModel.findOne({_id:idChat}).where({isGroupChat:true});
      
      if(chat){
        await chat.populate("users");
        chat.isActive = true;
        const updatedChat = await chat.save();

        return ResponseHandler<IChatModel>(updatedChat, MensajeHTTP.OK);
      }

      throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);

    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path)
    }
  }

  async AddUsersToGroupChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>>{
    try {
      const idChat = req.params.id!;
      const group:IGroupChatDTO = req.body;
      const { isValid, errors } = validateGroupChatDTO(group);

      if(isValid){
        const chat= await ChatModel.findOne({_id:idChat}).where({isGroupChat:true});
        
        if(chat){
          for(var id of group.idUsers ){
             const user = await UserModel.findById(id);
             if(user){
               chat.users.push(user);
             }
             else {
              throw ErrorHandler(CodigoHTTP.NotFound, `El usuario ID ${id} no existe.`, __filename);
             }
          }
          const updatedChat = await chat.save();
          await updatedChat.populate("users", "-password"); 
          await updatedChat.populate("groupAdmin", "-password");

          return ResponseHandler<IChatModel>(updatedChat, MensajeHTTP.OK);
        }
      }

      throw ErrorHandler(CodigoHTTP.NotFound, errors, __filename);

    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path)
    }
  }

  async RemoveUsersFromGroupChat(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel>>{
    try {
      const idChat = req.params.id!;
      const group:IGroupChatDTO = req.body;
      
      const { isValid, errors } = validateGroupChatDTO(group);

      if(isValid){
        const chat = await ChatModel.findOne({_id: idChat, isGroupChat: true});

        if(chat){
          const toBeDeleted:Types.ObjectId[] = group.idUsers.map(id => new Types.ObjectId(id));
          for(var idUser of toBeDeleted){
            if(idUser.equals(chat.groupAdmin!._id)){
              throw ErrorHandler(
                CodigoHTTP.InternalServerError, 
                'Error: No puedes remover al Admin del grupo', 
                __filename
              );
            }
            else {
              chat.users = chat.users.filter((user) =>  !user._id.equals(idUser));
            }
          }
          const updatedChat = await chat.save();
          await updatedChat.populate("users", "-password");
          await updatedChat.populate("groupAdmin", "-password");

          return ResponseHandler(updatedChat, MensajeHTTP.Deleted);
        }

        throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);

      }
      throw ErrorHandler(CodigoHTTP.NotFound, errors, __filename);
    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path)
    }
  }

  async GetAllActiveChats(req:WriteLineRequest) : Promise<IResponseHandler<IChatModel[]>>{
    try {

      const current:IUserModel = req.currentUser!;
      const chats:IChatModel[] = await ChatModel.find({
        users: { $elemMatch: { $eq: current._id }},
        isActive: true
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({updatedAt: -1})

      await UserModel.populate(chats, {
        path: "latestMessage.sender",
        select: "nombre image email"
      });

      return ResponseHandler<IChatModel[]>(chats, MensajeHTTP.OK);
    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  }

}


const ChatService = new ChatServices();
export default ChatService;