import { useEffect } from "react";
import HTTP from "../services/HttpService/HTTPService";
import UserService from "../services/UserService/UserService";
import notify from "../utils/notify";
import IUserDTO from "../models/UserModel";

export default function useGetCurrentUser(callback:(response:IUserDTO)=> void,  dependencies: any[]){
  useEffect(()=>{
    getCurrentUser(callback);
  }, dependencies)
}


export function getCurrentUser(callback:(response:IUserDTO)=> void){
  const current = HTTP.GetCurrentUser();
  UserService.GetUserByGUID(current.data.guid)
  .then((res:any)=>{
    callback(res.data as IUserDTO);
  })
  .catch((err:any)=>{
    notify(err.message, "error");
    throw err;
  })
}