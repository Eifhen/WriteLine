import IUserDTO from "../../models/UserModel";
import HTTP from "../HttpService/HTTPService";

class UserServices {

  GetUserByGUID(guid:string){
    return new Promise((resolve, reject)=>{
      HTTP.Get(`/users/${guid}`)
      .then((res)=>{
        resolve(res);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }

  GetUserImage(guid:string){
    return new Promise((resolve, reject)=>{
      HTTP.Get(`/users/image/${guid}`)
      .then((res)=>{
        resolve(res);
      })
      .catch((err)=> {
        reject(err);
      })
    })
  }
  
  GetUsersByQuery(queryString:string){
    return new Promise((resolve:(users:IUserDTO[]) => void, reject)=>{
      HTTP.Get(`/users?search=${queryString}`)
      .then((res:any)=>{
        resolve(res.data as IUserDTO[]);
      })
      .catch((err:any)=> {
        reject(err);
      })
    })
  }

  GetAllUsers(){
    return new Promise((resolve:(users:IUserDTO[]) => void, reject)=>{
      HTTP.Get(`/users/all`)
      .then((res:any)=>{
        resolve(res.data as IUserDTO[]);
      })
      .catch((err:any)=> {
        reject(err);
      })
    })
  }

}

const UserService = new UserServices();
export default UserService;