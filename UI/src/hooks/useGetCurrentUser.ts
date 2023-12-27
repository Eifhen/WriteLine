import { useEffect } from "react";
import HTTP from "../services/HttpService/HTTPService";
import UserService from "../services/UserService/UserService";
import notify from "../utils/notify";

export default function useGetCurrentUser(callback:(response:any)=> void,  dependencies: any[]){
  useEffect(()=>{
    const current = HTTP.GetCurrentUser();
    UserService.GetUserByGUID(current.data.guid)
    .then((res:any)=>{
      callback(res.data);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err;
    })

  }, dependencies)
}