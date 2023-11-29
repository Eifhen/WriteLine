import { CodigoHTTP } from "../Utilis/codigosHttp";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import { usersData } from "../Data/users";
import ISignInService from "../Interfaces/signin.service.interface";
import ILoginModel from "../Models/login.model";
import GetJWToken from "../Utilis/token";
import { validarEmail, validarPassword } from "../Validations/signup.validations";

class SignInService implements ISignInService {

  Login(data:ILoginModel): IResponseHandler<string> {
    const { email, password} = data;

    // Valida el email y password
    if(!validarEmail(email) || !validarPassword(password)){
      throw ErrorHandler(CodigoHTTP.BadRequest);
    }

    // Valida que el usuario exista
    const find = usersData.find(m=> {
      if(m.email.toLowerCase() === email.toLowerCase() && m.password === password){
        return m;
      }
    });

    // Generar y Devolver JWToken
    if(find){
      const token = GetJWToken(find.guid);
      return ResponseHandler<string>(token);
    }
 
    throw ErrorHandler(CodigoHTTP.NotFound, "No existe un usuario con este email o contraseña");
  }
}


const SignInServices = new SignInService();
export default SignInServices;

