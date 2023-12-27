import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { CodigoHTTP } from "../../utils/codigos.http.config";

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
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === CodigoHTTP.Unauthorized) {
          console.error("SetInstance Error =>", error);
          this.RemoveToken();
          window.location.replace('/home');
        }
    
        return Promise.reject(error);
      }
    );
    return instance;
  }

  StoreToken(token:string){
    localStorage.setItem("WL_TOKEN", token);
    this.axiosInstance.defaults.headers.common.Authorization = this.GetToken(token);
  }

  RemoveToken(){
    localStorage.removeItem("WL_TOKEN");
    this.axiosInstance.defaults.headers.common.Authorization = '';
  }

  DecodeToken(token: string) {
    return jwtDecode<any>(token);
  }

  GetToken(tk?:string){
    const token = tk ?? localStorage.getItem("WL_TOKEN");
    return token ? `Bearer ${token}` : '';
  }

  GetCurrentUser(){
    const token = this.GetToken().toString();
    const data = this.DecodeToken(token);
    return data;
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
    const deletePromise = data
    ? this.axiosInstance.delete(this.GetUrl(url), { data })
    : this.axiosInstance.delete(this.GetUrl(url));

    return new Promise<t>((resolve, reject)=>{
      deletePromise
      .then((res)=> resolve(res.data))
      .catch((err: any) => reject(err.response.data));
    })
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
