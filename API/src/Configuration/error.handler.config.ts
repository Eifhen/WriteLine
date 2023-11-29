import { Request, Response, NextFunction} from 'express';
import { GetHttpErrorMsg } from '../Utilis/codigosHttp';

export class RequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
      super(message);
      this.name = 'RequestError';
      this.status = status;
  }
}

export function ErrorHandler (status:number, msg?:string) : RequestError{
  const error_message = msg ?? GetHttpErrorMsg(status);
  return new RequestError(status, error_message);
}

export function RequestErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500; // Código de estado por defecto
  
  if (err instanceof RequestError && err.status) {
    statusCode = err.status;
  }
  
  console.log("RequestErrorHandler", {
    statusCode,
    message: err.message,
  });

  return res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? 'Error en el servidor' : err.stack // En producción, no mostrar detalles del error al cliente
  });
}


