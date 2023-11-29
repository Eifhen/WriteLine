import { nanoid } from "nanoid";
import ISignUpService from "../Interfaces/signup.service.interface";
import IUserModel from "../Models/user.model";
import { CodigoHTTP } from "../Utilis/codigosHttp";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import SignUpValidation from "../Validations/signup.validations";

class SignUpService implements ISignUpService {
  Register(data:IUserModel): IResponseHandler<IUserModel> {
    const validation = SignUpValidation.Validation(data); 
    if(validation === true){
      const newUser:IUserModel = {
        ...data,
        guid: nanoid(10)
      }
      return ResponseHandler(newUser);
    }
    else {
      throw ErrorHandler(CodigoHTTP.BadRequest, validation);
    }
  }
}


const SignUpServices = new SignUpService();
export default SignUpServices;