export default interface IUserModel {
  guid?:string;
  nombre:string;
  apellido:string;
  email:string;
  password:string;
  [key:string]:any;
}