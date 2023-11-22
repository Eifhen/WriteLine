
import ILoginModel from "../../models/LoginModel";
import HTTP from '../HttpService/HTTPService';


class SigninServices {

  GetModel(data:any) : ILoginModel{
    return {
      email: data.email.toString(),
      password: data.password.toString(),
    }
  }

  Login(data:ILoginModel){
    return new Promise((resolve, reject)=>{
      HTTP.AnonymousPost<any>("signin", data)
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
  }

}

const SigninService = new SigninServices();
export default SigninService;