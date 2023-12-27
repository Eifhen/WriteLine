import { useEffect } from "react";
import UserService from "../services/UserService/UserService";
import notify from "../utils/notify";

export default function useGetUserByGUID(guid:string, callback:(response:any)=> void, dependencies?:any[]){
  useEffect(()=>{
    UserService.GetUserByGUID(guid)
    .then((res)=>{
      callback(res);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err.message;
    })
  }, dependencies);
}