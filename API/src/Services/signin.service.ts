import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import ISignInService from "../Interfaces/signin.service.interface";
import ILoginModel, { validateLoginModel  } from "../Models/login.model";
import GetJWToken from "../Utilis/token";
import IUserModel, { UserModel } from "../Models/user.model";
import { ComparePassword } from "../Utilis/encrypt";

class SignInService implements ISignInService {

  async Login(data:ILoginModel): Promise<IResponseHandler<string>> {
    const { email, password } = data;
    const { isValid, errors } = validateLoginModel(data);

    // Valida el email y password
    if(!isValid){
      throw ErrorHandler(CodigoHTTP.BadRequest, JSON.stringify(errors), __filename);
    }
 
    // Valida que el usuario exista
    const find:IUserModel | null = await UserModel.findOne({ email }).exec();
    
    // Generar y Devolver JWToken
    if(find && (await ComparePassword(password, find.password))){
      const token = GetJWToken({guid:find.guid, email:find.email, password:find.password});
      return ResponseHandler<string>(token, MensajeHTTP.OK);
    }
 
    throw ErrorHandler(
      CodigoHTTP.NotFound, 
      "No existe un usuario con este email o contraseña", 
      __filename
    );
  }
}

const SignInServices = new SignInService();
export default SignInServices;

