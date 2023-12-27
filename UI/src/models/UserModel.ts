export default interface IUserDTO {
  _id?:any,
  guid?:string;
  nombre:string;
  apellido:string;
  email:string;
  password:string;
  image?:IUserImageDTO;
  [key:string]:any;
}

export interface IUserImageDTO {
  fileName?:string;
  extension:string;
  base64:string;
  result?:any;
}