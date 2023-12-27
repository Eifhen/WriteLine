export interface AuthenticatedUserModel {
  guid: number;
  name: string;
  lastname:string;
  email: string;
  [key:string]:any;
}

export interface IDecodedToken {
  email: string;
  guid: string;
  password: string;
}