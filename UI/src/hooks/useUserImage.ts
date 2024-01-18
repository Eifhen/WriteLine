import { useEffect, useState } from "react";
import UserService from "../services/UserService/UserService";
import UserIcon from '../assets/images/user_icon2.png';
import { IChatModel } from "../models/ChatModel";

export interface IImageRecord {
  [key:string]:string;
}


export function useGetUserImageByGUID(guid:string, callback:(response:any)=> void, dependencies?:any[]){
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

export function useUserImage(guid:string, dependencies?:any[]){
  const [image, setImage] = useState({[guid]:UserIcon} as IImageRecord);
  
  useEffect(()=>{
    UserService.GetUserImage(guid)
    .then((res:any)=>{
      setImage(prev => ({
        ...prev, [guid]: res.data
      }));
    })
    .catch((err:any)=>{
      throw err.message;
    })
  }, dependencies);

  return image;
}

export function useGetUsersImages(chat:IChatModel, dependencies?:any[]){
  const [images, setImages] = useState<IImageRecord>(
    {["default"]:UserIcon}
  );
  
  useEffect(()=>{
    if(chat && chat.isGroupChat && chat.users){
      chat.users.map((user)=> {
        if(user.guid){
          UserService.GetUserImage(user.guid)
          .then((res:any)=>{
            setImages(prev => {
              return {...prev, [user.guid!] : res.data}
            });
          })
          .catch((err:any)=>{
            throw err.message;
          })
        }
      })
    }
  }, dependencies);

  return images;
}