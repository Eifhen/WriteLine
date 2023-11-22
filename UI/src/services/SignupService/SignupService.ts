import IUserModel from "../../models/UserModel";
import HTTP from '../HttpService/HTTPService';


class SignupServices {

  GetModel(data:any) : IUserModel{
    return {
      nombre: data.nombre.toString(),
      apellido: data.apellido.toString(),
      email: data.email.toString(),
      password: data.password.toString(),
    }
  }

  Register(data:IUserModel){
    return new Promise((resolve, reject)=>{
      HTTP.AnonymousPost<IUserModel>("signup", data)
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
  }

}

const SignupService = new SignupServices();
export default SignupService;