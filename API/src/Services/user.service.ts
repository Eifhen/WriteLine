import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";
import IUserService from "../Interfaces/user.service.interface";
import IUserModel, { IUserImage, UserModel, validateUserModel } from "../Models/user.model";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { isNotEmpty } from "../Utilis/isEmpty";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import {nanoid} from 'nanoid';
import WriteLineRequest from "../Interfaces/auth.request.interface";
import IUserDTO, { ToUserDTO, validateUserDTO } from "../DTO/user.dto";
import ImageManager from '../Utilis/image.manager';
import IImageManager from "../Interfaces/image.manager.interface";
import TransactionManager from "../Utilis/transaction.manager";
import { SearchCommands } from "../Utilis/enums";
import { IMAGE_BASE64_PATTERN } from "../Patterns/image.pattern";

export class UserService implements IUserService {

  imageManager: IImageManager;

  constructor(){
    this.imageManager = new ImageManager();
  }

  async GetAllUsers(req:WriteLineRequest) : Promise<IResponseHandler<IUserDTO[]>> {
    // busca todos los usuarios excepto el actualmente logeado
    const current = req.currentUser!;
    const find:IUserModel[] | null = await UserModel.find({ _id: { $ne: current._id }}).lean().exec();

    if(find) { 
      const usersDTO:IUserDTO[] = find.map(u => ToUserDTO(u));
      return ResponseHandler<IUserDTO[]>(usersDTO, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
  }
  
  async GetUsersByQuery(req:WriteLineRequest) : Promise<IResponseHandler<IUserDTO[]>>{
    try {
      const current = req.currentUser!;
      const { search } = req.query;
      if(search === SearchCommands.All){
        const find:IUserModel[] | null = await UserModel.find({ _id: { $ne: current._id }}).lean().exec();
        const usersDTO:IUserDTO[] = find.map(u => ToUserDTO(u));
        return ResponseHandler<IUserDTO[]>(usersDTO, MensajeHTTP.OK);
      }
      else {
        const keywords = {
          $or:[
            { nombre: {$regex: search ?? '', $options: 'i' } },
            { email: {$regex: search ?? '', $options: 'i' }}
          ]
        };
    
        // busca los usuarios que cuyo email o nombre corresponda a la keyword enviada por el queryString
        // excepto el usuario actual logeado.
        const users:IUserModel[] = await UserModel.find(keywords).find({ _id: { $ne: current._id }}).lean().exec();
        const usersDTO:IUserDTO[] = users.map(u => ToUserDTO(u));
        return ResponseHandler<IUserDTO[]>(usersDTO, MensajeHTTP.OK);
      }
    }
    catch(err:any){
      throw ErrorHandler(CodigoHTTP.InternalServerError, '', __filename);
    }
  }

  async GetUser(guid:string) : Promise<IResponseHandler<IUserDTO>>{
    const find:IUserModel | null = await UserModel.findOne({ guid });
    if(find) { 
      const user:IUserDTO = ToUserDTO(find);
      if(user.image?.fileName && !user.image?.url){
        const {fileName, extension} = user.image;
        user.image.url = await this.imageManager.GetImageCloudURL(fileName, extension);
      }
      return ResponseHandler<IUserDTO>(user, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
  }

  async GetUsersById(ids:string[]) : Promise<IUserModel[]>{
    try {
      let users:IUserModel[] = [];
      
      for(var id of ids){
        const find:IUserModel | null = await UserModel.findById(id).lean().exec();
        if(find){
          users.push(find);
        } 
      }
      return users;
    }
    catch(error:any){
      throw ErrorHandler(CodigoHTTP.InternalServerError, error.message, __filename);
    }
  }

  async AddUser(user:IUserModel) : Promise<IResponseHandler<IUserModel>>{
    if(isNotEmpty(user) && validateUserModel(user)){
      const newUser = new UserModel({
        ...user,
        guid: nanoid(10),
      }); 
     
      const savedUser:IUserModel = await newUser.save();

      return ResponseHandler<IUserModel>(savedUser, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.BadRequest, '', __filename);
  }

  async UpdateUser(guid:string, user:IUserDTO) : Promise<IResponseHandler<IUserDTO>>{
    const {isValid, errors} = validateUserDTO(user); 
    if(isValid){   
      const find = await UserModel.findOne({ guid }).exec();
      const { session, commitTransaction, rollBack  } = await TransactionManager();

      if(find){
        try {
          find.nombre = user.nombre;
          find.apellido = user.apellido;
          find.email = user.email;
          if(user.password){
            find.password = user.password;
          }

          if(user.image && user.image.base64){
            user.image.fileName = this.imageManager.setUserImageName(find.guid);

            if(find.image && isNotEmpty(find.image.fileName) && isNotEmpty(find.image.extension) ){
              // si ya existe una imagen la removemos
              await this.imageManager.DeleteImageFromCloud(find.image.fileName, find.image.extension);
            }
            const base64Data = user.image.base64.replace(IMAGE_BASE64_PATTERN, '');
            const result = await this.imageManager.SaveImageInCloud(user.image.fileName, user.image.extension, base64Data);
            
            find.image = {
              base64: '', // el base64 no lo guardo en la bd;
              fileName: user.image.fileName,
              extension: user.image.extension,
              url: result.url
            } as IUserImage;
          }
          
          const updatedUser:IUserModel = await find.save({session});
          const userDTO:IUserDTO = ToUserDTO(updatedUser);

          if(user.image && user.image.base64 && user.image.extension && userDTO.image){
            //userDTO.image.base64 = this.imageManager.GetImageFormat(user.image.base64, user.image.extension);
            userDTO.image.url = updatedUser.image?.url;
          }

          await commitTransaction();
          return ResponseHandler<IUserDTO>(userDTO, MensajeHTTP.OK);

        }
        catch(err:any){
          await rollBack(); 
          throw ErrorHandler(CodigoHTTP.BadRequest, err.message, __filename);
        }
      }
      throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
    }
    throw ErrorHandler(CodigoHTTP.BadRequest, errors, __filename);
  }

  async DeleteUser(guid: string): Promise<IResponseHandler<IUserModel>> {
    const deletedUser:IUserModel | null = await UserModel.findOneAndDelete({ guid }).lean().exec();
    if(deletedUser){
      return ResponseHandler<IUserModel>(deletedUser as IUserModel, MensajeHTTP.Deleted);
    }
    throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
  }

  async GetUserImage(guid:string): Promise<IResponseHandler<string>> {
    try {
      const find:IUserModel | null = await UserModel.findOne({ guid }).lean().exec();
      if(find) { 
        const user:IUserDTO = ToUserDTO(find);
        if(user.image?.fileName){
          const {fileName, extension} = user.image;
          if(user.image?.url){
            return ResponseHandler<string>(user.image?.url, MensajeHTTP.OK);
          }
          //const base64 = await this.imageManager.GetImage(fileName, extension);
          const url = await this.imageManager.GetImageCloudURL(fileName, extension);
          return ResponseHandler<string>(url, MensajeHTTP.OK);
        }
        throw ErrorHandler(CodigoHTTP.NotFound, 'Sin imagen', __filename);
      }
      throw ErrorHandler(CodigoHTTP.NotFound, 'Error al buscar el usuario', __filename);

    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  }

  async UpdatePassword(req:WriteLineRequest) : Promise<IResponseHandler<string>>{
    try {
      const currentUser = req.currentUser;
      const newPassword = req.body.password;
  
      if(currentUser){
        currentUser.password = newPassword;
        
        await currentUser.save();
        
        return ResponseHandler<string>('Contraseña actualizada.', MensajeHTTP.OK);
      }
  
      throw ErrorHandler(CodigoHTTP.BadRequest, '', __filename);
    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  }

}



const UserServices = new UserService();
export default UserServices;

