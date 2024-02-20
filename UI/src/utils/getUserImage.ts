import UserService from "../services/UserService/UserService";


export default function getUserImage(userGuid:string, callback:(data:any)=> void){
  UserService.GetUserImage(userGuid)
  .then((res:any)=>{
    callback(res);
  })
  .catch((err:any)=>{
    throw err.message;
  })
}