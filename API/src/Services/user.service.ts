import { CodigoHTTP, MensajeHTTP } from "../Configuration/codigos.http.config";
import { usersData } from "../Data/users";
import IUserService from "../Interfaces/user.service.interface";
import IUserModel from "../Models/user.model";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { isNotEmpty } from "../Utilis/isEmpty";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import {nanoid} from 'nanoid';
 
export class UserService implements IUserService {

  constructor(){}

  GetUsers() : IResponseHandler<IUserModel[]>{
    try {
      return ResponseHandler<IUserModel[]>(usersData, MensajeHTTP.OK);
    }
    catch(err:any){
      throw ErrorHandler(CodigoHTTP.InternalServerError);
    }
  }

  GetUser(guid:string) : IResponseHandler<IUserModel>{
    const find = usersData.find(m => m.guid === guid);
    if(find) { 
      return ResponseHandler<IUserModel>(find, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.NotFound);
  }

  AddUser(user:IUserModel) : IResponseHandler<IUserModel>{
    if(isNotEmpty(user)){ 
      const new_user:IUserModel = {
        guid: nanoid(10),
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: user.password
      }
      usersData.push(new_user); 
      return ResponseHandler<IUserModel>(new_user, MensajeHTTP.OK);
    }
    throw ErrorHandler(CodigoHTTP.BadRequest);
  }

  UpdateUser(guid:string, user:IUserModel) : IResponseHandler<IUserModel>{
    if(isNotEmpty(user)){   
      const find = usersData.find(m => m.guid === guid);
      if(find){
        find.nombre = user.nombre;
        find.apellido = user.apellido;
        find.email = user.email;
        find.password = user.password
        return ResponseHandler<IUserModel>(find, MensajeHTTP.OK);
      }
      throw ErrorHandler(CodigoHTTP.NotFound);
    }
    throw ErrorHandler(CodigoHTTP.BadRequest);
  }

  DeleteUser(guid: string): IResponseHandler<IUserModel[]> {
    const find = usersData.findIndex(m => m.guid === guid);
    if(find){
      usersData.splice(find, 1);
      return ResponseHandler<IUserModel[]>(usersData, MensajeHTTP.Deleted);
    }
    throw ErrorHandler(CodigoHTTP.NotFound);
  }
}



const UserServices = new UserService();
export default UserServices;

