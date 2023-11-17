import { isNotEmpty } from "./isEmpty";




export interface IResponseHandler<T>{
  data?: T;
  message?: string;
}

export function ResponseHandler<T>(...params: (T | string)[]) : IResponseHandler<T>{
  const [param1, param2] = params;

  const data = typeof param1 !== 'string' && isNotEmpty(param1) ? param1 : typeof param2 !== 'string' && isNotEmpty(param2) ? param2 : {} as T;
  const message = typeof param1 === 'string' ? param1 : typeof param2 === 'string' ? param2 : '';

  return {
    data,
    message,
  };
}