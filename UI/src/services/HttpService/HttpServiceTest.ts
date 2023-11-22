import axios, { AxiosInstance } from "axios";
import { AuthenticatedUserModel } from "../../models/AuthenticatedUserModel";
import json from "../../utils/json";

class HttpServiceTEST {

  axiosInstance: AxiosInstance;
  token="";
  user:any;
  API_URL = import.meta.env.VITE_API_URL;
  API_KEY = import.meta.env.VITE_WRITELINE_APIKEY;
  API_KEY_HEADER = import.meta.env.VITE_API_KEY_HEADER;
  AUTORIZATION_HEADER = import.meta.env.VITE_AUTORIZATION_HEADER;

  constructor (){
    var self = this;
 
    const instance = axios.create({});
    axios.defaults.headers.common[this.API_KEY_HEADER] = this.API_KEY!;
    
    // Modifica el comportamiento de la respuesta cuando
    // la respuesta es exitosa o cuando hay algún error
    instance.interceptors.response.use(
    (res)=> {
      return res;
    }, 
    (err) => {
      if(err.response.status === 401){
        self.RemoveToken();
        window.location.replace("/home");
      }
      return Promise.reject(err);
    })

    instance.defaults.headers.common[this.AUTORIZATION_HEADER] = `Bearer ${this.GetToken()}`;
    instance.defaults.headers.common[this.API_KEY_HEADER] = this.API_KEY!;
    this.axiosInstance = instance;
  }

  GetToken() {
    return this.token;
  }

  GetUser(): AuthenticatedUserModel {
    if (!this.user) {
      const data: any = localStorage.getItem('WL_UDATA');
      this.user = data != undefined ? json(data) : {};
    }
    return this.user;
  }

  RemoveToken() {
    localStorage.removeItem('WL_TK');
    localStorage.removeItem('WL_UDATA');
    this.token = '';
    this.user = null;
    this.axiosInstance.defaults.headers.common[this.AUTORIZATION_HEADER] = '';

   // if (this.onLoggout) this.onLoggout();
  }

  StoreToken(token: any, user: AuthenticatedUserModel) {
    localStorage.setItem('WL_TK', token);
    localStorage.setItem('WL_UDATA', JSON.stringify(user));
    this.user = user;
    this.token = token;
    this.axiosInstance.defaults.headers.common[this.AUTORIZATION_HEADER] = `Bearer ${token}`;
  }

  GetCommonHeaders() {
    return {
      Authorization: 'Bearer ' + this.GetToken(),
      [this.API_KEY_HEADER]: this.API_KEY!,
    };
  }

  getUrl(url: string): any {
    if (
      url.toLowerCase().startsWith('http') ||
      url.toLowerCase().startsWith('https')
    ) {
      return url;
    }
    return this.API_URL + url;
  }

  Get<t>( url: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .get(this.getUrl(url))
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  Post<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .post(this.getUrl(url), data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  Put<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .put(this.getUrl(url), data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  Delete<t>(url: any, data?: any): Promise<t> {
    if (data) {
      return new Promise<t>((resolve, reject)=>{
        this.axiosInstance
          .delete(this.getUrl(url), {data})
          .then((res: any)=> resolve(res.data))
          .catch((err: any)=> reject(err));
      });
    }
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .delete(this.getUrl(url))
        .then((res: any) => resolve(res.data))
        .catch((err: any) => reject(err));
    });
  }

  AnonymousPost<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      axios
        .post(this.getUrl(url), data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }



}


const HTTPTEST = new HttpServiceTEST();
export default HTTPTEST;