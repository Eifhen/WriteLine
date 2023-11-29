import HTTP from "../HttpService/HTTPService"


class TestServices {

  GetUsers () {
    return new Promise((resolve, reject)=>{
      HTTP.Get('user')
      .then((res)=> { resolve(res); })
      .catch((err:any)=> { reject(err); })
    })
  }

}

const TestService = new TestServices;
export default TestService;