import { nanoid } from "nanoid";
import ISignUpService from "../Interfaces/signup.service.interface";
import IUserModel, { UserModel, validateUserModel } from "../Models/user.model";
import { CodigoHTTP, MensajeHTTP } from "../Utilis/codigosHttp";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { IResponseHandler, ResponseHandler } from "../Configuration/response.handler.config";
import ImageManager from "../Utilis/image.manager";
import TransactionManager from "../Utilis/transaction.manager";
import { IMAGE_BASE64_PATTERN } from "../Patterns/image.pattern";
import IUserDTO from "../DTO/user.dto";

class SignUpService implements ISignUpService {

  async Register(data:IUserModel): Promise<IResponseHandler<IUserModel>> {
    const guid = nanoid(10);
    const imageFileName = `user_${guid}`;
    const imageManager = new ImageManager();
    const { session, commitTransaction, rollBack  } = await TransactionManager();

    try {
      const {isValid, errors} = validateUserModel(data); 
      if(isValid){
        // Guardar la imagen en el servidor
        if (data.image?.base64) {
          const extension = data.image.extension;
          const base64Data = data.image.base64.replace(IMAGE_BASE64_PATTERN, '');
          data.image.fileName = await imageManager.SaveImage(base64Data, imageFileName, extension);
          data.image.base64 = '';
        }
        
        const newUser = new UserModel({...data, guid});

        await newUser.save({ session });  

        await commitTransaction(); // Confirma la transacción
        
        return ResponseHandler(newUser, MensajeHTTP.OK);
      }
      else {
        throw ErrorHandler(
          CodigoHTTP.BadRequest, 
          "El formulario ingresado es invalido.", 
          __filename
        );
      }
    }
    catch(err:any){
      await rollBack(); 
      await imageManager.RemoveImage(imageFileName);
      throw ErrorHandler(CodigoHTTP.BadRequest, err.message, __filename);
    }
  }
}


const SignUpServices = new SignUpService();
export default SignUpServices;