import { isNotEmpty } from "../Utilis/isEmpty";




export interface IResponseHandler<T>{
  data?: T;
  message?: string;
  redirect?: string;
}

export function ResponseHandler<T>(data:T, message?:string, redirect?:string) : IResponseHandler<T>{
  return {
    data,
    message,
    redirect
  };
}