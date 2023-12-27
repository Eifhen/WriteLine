import jwt from 'jsonwebtoken';
import Configuration from '../Configuration/configurations';
import { ErrorHandler } from '../Configuration/error.handler.config';
import { CodigoHTTP } from './codigosHttp';


const config = Configuration();
const SECRET = config.tk_key!;

export default function GetJWToken(payload:any){
  const data = {data:payload};
  //return jwt.sign(data, SECRET, { expiresIn: '1d', algorithm:"HS256" });
  return jwt.sign(data, SECRET, { algorithm:"HS256" });
}

export function DecodeJWToken(token: string) {
  try {
    const tk = token.split(" ")[1]; // quitamos el Bearer
    const decoded = jwt.verify(tk, SECRET);
    console.log("Decoded =>", decoded, __filename);
    return decoded;
  } catch (error:any) {
    throw ErrorHandler(
      CodigoHTTP.Unauthorized, 
      `Error al decodificar el token: ${error.message}`,
      __filename  
    )
  }
}