export default interface IUserDTO {
  _id?:any,
  guid?:string;
  nombre:string;
  apellido:string;
  email:string;
  password:string;
  image?:IUserImageDTO;
  date?:Date;
  [key:string]:any;
}

export interface IUserImageDTO {
  fileName?:string;
  extension:string;
  base64:string;
  url?:string;
  result?:any;
}

export const emptyUserDTO = () : IUserDTO => ({
  _id:'',
  guid:'',
  nombre:'',
  apellido:'',
  email:'',
  password:'',
  date: new Date(),
  image:{
    fileName:'',
    extension:'',
    base64:'',
    result:'',
    url: '',
  }
})