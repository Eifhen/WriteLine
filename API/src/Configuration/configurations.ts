const dotenv = require("dotenv");
const path = require('path');


type Environment = "development" | "production" | undefined;

export interface IConfiguracion {
  port:string | undefined;
  connectionString:string | undefined;
  enviroment: Environment;
  apikey:string | undefined;
  apikeyHeader:string | undefined;
  autorizationHeader: string | undefined;
  autorizationKey: string | undefined;
  autenticationKey: string | undefined;
  tk_key: string | undefined;
}

export default function Configuration() : IConfiguracion {
  dotenv.config(); 
  process.env.NODE_ENV = 'development'; // development || production

  const envPath = path.resolve(__dirname, '../..');
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(envPath, '.env.production') });
  } else {
    dotenv.config({ path: path.resolve(envPath, '.env.development') });
  }
  
  return  {
    port: process.env.PORT,
    enviroment: process.env.NODE_ENV as Environment,
    connectionString: process.env.CONNECTION_STRING,
    apikey: process.env.WRITELINE_APIKEY,
    apikeyHeader: process.env.API_KEY_HEADER,
    autorizationHeader: process.env.AUTORIZATION_HEADER,
    autenticationKey: process.env.AUTENTICATION_KEY,
    autorizationKey: process.env.AUTORIZATION_KEY,
    tk_key: process.env.TK_KEY,
  }
}






