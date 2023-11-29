import jwt from 'jsonwebtoken';
import Configuration from '../Configuration/configurations';


const config = Configuration();
const SECRET = config.tk_key!;

export default function GetJWToken(payload:any){
  const data = {guid:payload};
  return jwt.sign(data, SECRET, { expiresIn: '1h', algorithm:"HS256" });
}

export function DecodeJWToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("decoded =>", decoded);
    return decoded;
  } catch (error:any) {
    console.error('Error al decodificar el token:', error.message);
    return null;
  }
}