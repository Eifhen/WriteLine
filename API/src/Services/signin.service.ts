import { CodigoHTTP } from "../Configuration/codigos.http.config";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import { usersData } from "../Data/users";
import ISignInService from "../Interfaces/signin.service.interface";
import ILoginModel from "../Models/login.model";
import { validarEmail, validarPassword } from "../Validations/signup.validations";


class SignInService implements ISignInService {

  Login(data:ILoginModel): IResponseHandler<ILoginModel> {
    const { email, password} = data;
    if(!validarEmail(email) || !validarPassword(password)){
      throw ErrorHandler(CodigoHTTP.BadRequest);
    }

    const find = usersData.find(m=> {
      if(m.email.toLowerCase() === email.toLowerCase() && m.password === password){
        return m;
      }
    });

    if(find){
      return ResponseHandler(data);
    }
 
    throw ErrorHandler(CodigoHTTP.NotFound, "No existe un usuario con este email o contraseña");
  }
}


const SignInServices = new SignInService();
export default SignInServices;