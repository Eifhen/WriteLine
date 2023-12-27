import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";
import IUserService from "../Interfaces/user.service.interface";
import IUserModel, { UserModel, validateUserModel } from "../Models/user.model";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { isNotEmpty } from "../Utilis/isEmpty";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import {nanoid} from 'nanoid';
import WriteLineRequest from "../Interfaces/auth.request.interface";
import IUserDTO, { ToUserDTO } from "../DTO/user.dto";
import ImageManager from '../Utilis/image.manager';
import IImageManager from "../Interfaces/image.manager.interface";
 
export class UserService implements IUserService {

  imageManager: IImageManager;

  constructor(){
    this.imageManager = new ImageManager();
  }

  async GetAllUsers(req:WriteLineRequest) : Promise<IResponseHandler<IUserModel[]>> {
    const find:IUserModel[] | null = await UserModel.find().lean().exec();

    if(find) { 
      return ResponseHandler<IUserModel[]>(find, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
  }
  
  async GetUsersByQuery(req:WriteLineRequest) : Promise<IResponseHandler<IUserDTO[]>>{
    try {
      const current = req.currentUser!;
      const { search } = req.query;
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
    catch(err:any){
      throw ErrorHandler(CodigoHTTP.InternalServerError, '', __filename);
    }
  }

  async GetUser(guid:string) : Promise<IResponseHandler<IUserDTO>>{
    const find:IUserModel | null = await UserModel.findOne({ guid }).lean().exec();
    if(find) { 
      const user:IUserDTO = ToUserDTO(find);
      if(user.image?.fileName){
        const {fileName, extension} = user.image;
        user.image.base64 = await this.imageManager.GetImage(fileName, extension);
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

  async UpdateUser(guid:string, user:IUserModel) : Promise<IResponseHandler<IUserModel>>{
    if(isNotEmpty(user) && validateUserModel(user)){   
      const find = await UserModel.findOne({ guid }).exec();

      if(find){
        find.nombre = user.nombre;
        find.apellido = user.apellido;
        find.email = user.email;
        find.password = user.password
        
        const updatedUser:IUserModel = await find.save();

        return ResponseHandler<IUserModel>(updatedUser, MensajeHTTP.OK);
      }
      throw ErrorHandler(CodigoHTTP.NotFound, '', __filename);
    }
    throw ErrorHandler(CodigoHTTP.BadRequest, '', __filename);
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
          const base64 = await this.imageManager.GetImage(fileName, extension);
          return ResponseHandler<string>(base64, MensajeHTTP.OK);
        }
        throw ErrorHandler(CodigoHTTP.NotFound, 'Sin imagen', __filename);
      }
      throw ErrorHandler(CodigoHTTP.NotFound, 'Error al buscar el usuario', __filename);

    }
    catch(err:any){
      throw ErrorHandler(err.status, err.message, err.path);
    }
  }

}



const UserServices = new UserService();
export default UserServices;

