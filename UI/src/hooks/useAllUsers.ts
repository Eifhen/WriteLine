import { useEffect } from "react";
import UserService from "../services/UserService/UserService";
import notify from "../utils/notify";



export default function useGetAllUsers(callback:(response:any)=> void,  dependencies: any[]){
  useEffect(()=>{
    UserService.GetAllUsers()
    .then((res:any)=>{
      callback(res);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err;
    })

  }, dependencies)
}