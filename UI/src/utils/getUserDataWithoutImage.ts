import IUserDTO, { IUserImageDTO } from "../models/UserModel";






export default function getUserDataWithoutImage (data:IUserDTO) {
  const userData:IUserDTO = {
    ...data,
    image: {} as  IUserImageDTO 
  } 
  return userData;
}