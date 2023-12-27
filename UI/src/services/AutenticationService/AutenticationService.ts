import HTTP from "../HttpService/HTTPService";


class AutenticationServices {
  isAuthenticated = false;

  constructor() {
    this.isAuthenticated = this.VerifyToken();
  }

  VerifyToken(){
    const token = HTTP.GetToken();
    return token ? true : false;
  }

  // falta implementar
  LogOut(callback?: () => any): void {
    this.isAuthenticated = false;
    HTTP.RemoveToken();
    if(callback){
      callback()
    }
  }

}

const AutenticationService = new AutenticationServices();
export default AutenticationService;