import axios, { AxiosInstance } from "axios";
import toJson from "../../utils/json";

/*
  Esta clase se encarga de realizar las peticiones HTTP,
  se encarga de mandar los HEADERS con los KEYS correspondientes
  en cada REQUEST
*/
class HTTPService {

  API_URL = import.meta.env.VITE_API_URL;
  API_KEY= import.meta.env.VITE_WRITELINE_APIKEY;
  API_KEY_HEADER= import.meta.env.VITE_API_KEY_HEADER;
  axiosInstance: AxiosInstance;

  constructor(){
    this.axiosInstance = this.SetInstance();
    axios.defaults.headers.common[this.API_KEY_HEADER] = this.API_KEY;
  }

  SetInstance(){
    const instance = axios.create({});
    instance.defaults.headers.common.Authorization = this.GetToken() ?? '';
    instance.defaults.headers.common[this.API_KEY_HEADER] = this.API_KEY;
    return instance;
  }

  StoreToken(token:string){
    localStorage.setItem("WL_TOKEN", token);
  }

  RemoveToken(){
    localStorage.removeItem("WL_TOKEN");
    this.axiosInstance.defaults.headers.common.Authorization = '';
  }

  GetToken(){
    const token = localStorage.getItem("WL_TOKEN");
    console.log("token =>", token);
    return token;
    //return toJson(token);
  }


  GetUrl(url:string){
    if (
      url.toLowerCase().startsWith('http') || 
      url.toLowerCase().startsWith('https')
    ) {
      return url;
    }
    return `${this.API_URL}${url}`;
  }

  Get<t>( url: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .get(this.GetUrl(url))
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          reject(err.response.data);
        });
    });
  }

  Post<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .post(this.GetUrl(url), data)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          reject(err.response.data);
        });
    });
  }

  Put<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .put(this.GetUrl(url), data)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          reject(err.response.data);
        });
    });
  }

  Delete<t>(url: any, data?: any): Promise<t> {
    if (data) {
      return new Promise<t>((resolve, reject)=>{
        this.axiosInstance
          .delete(this.GetUrl(url), {data})
          .then((res: any)=> resolve(res.data))
          .catch((err: any)=> reject(err.response.data));
      });
    }
    return new Promise<t>((resolve, reject) => {
      this.axiosInstance
        .delete(this.GetUrl(url))
        .then((res: any) => resolve(res.data))
        .catch((err: any) => reject(err.response.data));
    });
  }

  AnonymousPost<t>(url: any, data: any): Promise<t> {
    return new Promise<t>((resolve, reject) => {
      axios
        .post(this.GetUrl(url), data)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          reject(err.response.data);
        });
    });
  }


}


const HTTP = new HTTPService();
export default HTTP;
