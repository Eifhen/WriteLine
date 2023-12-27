import { isNotEmpty } from "../Utilis/isEmpty";




export interface IResponseHandler<T>{
  data?: T;
  message?: string;
  redirect?: string;
}

/**
  @param data -Data a enviar como respuesta
  @param message -Mensaje a enviar en la respuesta
  @param redirect -Link indicado para redireccionar a cualquier otro luegar si es necesario
  @return Response
 */
export function ResponseHandler<T>(data:T, message?:string, redirect?:string) : IResponseHandler<T>{
  return {
    data,
    message,
    redirect
  };
}