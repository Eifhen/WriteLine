import IUserDTO, { IUserImageDTO } from "../../models/UserModel";
import HTTP from '../HttpService/HTTPService';


class SignupServices {

  GetModel(data:any, userImage?:IUserImageDTO) : IUserDTO{
    return {
      nombre: data.nombre.toString(),
      apellido: data.apellido.toString(),
      email: data.email.toString(),
      password: data.password.toString(),
      image:userImage,
    }
  }

  Register(data:IUserDTO){
    return new Promise((resolve, reject)=>{
      HTTP.AnonymousPost<IUserDTO>("signup", data)
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
  }

}

const SignupService = new SignupServices();
export default SignupService;