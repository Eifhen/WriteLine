import { useEffect } from "react";
import UserService from "../services/UserService/UserService";
import notify from "../utils/notify";




export default function useGetUserImageByGUID(guid:string, callback:(response:any)=> void, dependencies?:any[]){
  useEffect(()=>{
    UserService.GetUserImage(guid)
    .then((res:any)=>{
      callback(res.data);
    })
    .catch((err:any)=>{
      throw err.message;
    })
  }, dependencies);
}