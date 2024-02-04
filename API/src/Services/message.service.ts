import { Types } from "mongoose";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import IMessageDTO, { validateMessageDTO } from "../DTO/message.dto";
import WriteLineRequest from "../Interfaces/auth.request.interface";
import IMessageService from "../Interfaces/message.service.interface";
import { ChatModel, IChatModel } from "../Models/chat.model";
import IMessageModel, { MessageModel, validateMessageModel } from "../Models/message.model";
import { UserModel } from "../Models/user.model";
import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";

class MessageServices implements IMessageService {
  
  async SendMessage (req: WriteLineRequest) : Promise<IResponseHandler<IMessageModel>> {
    try {
      const data:IMessageDTO = req.body;
      const currentUser = req.currentUser;

      const {isValid, errors} = validateMessageDTO(data);

      if(isValid && currentUser){
        const chat = await ChatModel.findById(data.idChat);

        if(chat){

          const addedMessage = await MessageModel.create({
            sender: currentUser,
            content: data.message,
            chat: chat,
            date: new Date()
          } as IMessageModel);

          await addedMessage.populate("sender", "-password");
          await addedMessage.populate("chat");
          await addedMessage.populate({
            path: "chat",
            populate: { 
              path: "users",
              select: "-password"
            }
          });

          chat.latestMessage = addedMessage;
          await chat.save();

          return ResponseHandler<any>(addedMessage, MensajeHTTP.OK);
        }

        throw ErrorHandler(CodigoHTTP.NotFound, "No se encontro un chat con este id", __filename);
      }
      
      throw ErrorHandler(CodigoHTTP.BadRequest, errors, __filename);

    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  };

  async GetAllMessages(req: WriteLineRequest) : Promise<IResponseHandler<IMessageModel[]>> {
    try {
      const { chatID } = req.params;

      if(chatID){

        const id = new Types.ObjectId(chatID);
        const messages:IMessageModel[] = await MessageModel.find({
          chat: id
        })
        .populate("sender", "-password")
        .populate("chat");

        if(messages){
          return ResponseHandler<IMessageModel[]>(messages, MensajeHTTP.OK);
        }

        throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
      }

      throw ErrorHandler(CodigoHTTP.BadGateway, '', __filename);
    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  };

}

const MessageService = new MessageServices();
export default MessageService;