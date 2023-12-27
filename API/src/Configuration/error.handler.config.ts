import { Request, Response, NextFunction} from 'express';
import { GetHttpErrorMsg } from '../Utilis/codigosHttp';
import { ifEmpty } from '../Utilis/isEmpty';
import ConsoleError from '../Utilis/consoleColor';

export class RequestError extends Error {
  status: number;
  path:string;

  constructor(status: number, message: string, path:string) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.path = path;
  }
}

export function ErrorHandler (status:number, msg?:string, path:string = '') : RequestError{
  if(typeof msg === "object"){
    msg = JSON.stringify(msg);
  }
  let error_message = ifEmpty(msg, GetHttpErrorMsg(status));
  return new RequestError(status, error_message, path);
}

export function RequestErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500; // Código de estado por defecto
  let path = '';
  
  if (err instanceof RequestError && err.status) {
    statusCode = err.status;
    path = err.path;
  }

  ConsoleError("RequestErrorHandler", {
    statusCode,
    message: err.message,
    path: path,
    stack: err.stack
  });
 
  return res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    path,
    error: process.env.NODE_ENV === 'production' ? 'Error en el servidor' : err.stack // En producción, no mostrar detalles del error al cliente
  });
}



