
import bcrypt from "bcrypt";
import { ErrorHandler } from "../Configuration/error.handler.config";
import { CodigoHTTP } from "./codigosHttp";

/**
 Función que sirve para encriptar una contraseña
 @param password -Contraseña a editar
 @return contraseña encryptada.
*/
export async function EncryptPassword(password:string){
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  }
  catch(err:any){
    throw ErrorHandler(
      CodigoHTTP.InternalServerError, 
      'Error al encryptar la contraseña', 
      __filename
    );
  }
}
/**
  @param password1 — Data a ser encriptada.
  @param password2 — La data con la cual se va a comparar el password1.
  @return — retorna una promesa con el resultado de la operación o un error
 */
export async function ComparePassword(password1:string, password2:string){
  return await bcrypt.compare(password1, password2);
}
