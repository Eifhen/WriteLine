import { Request, Response } from "express";
const dotenv = require("dotenv");
const path = require('path');

export enum EnvironmentStates {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

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
  Deploy(app: any, express: any): void;
}

export default function Configuration() : IConfiguracion {
  dotenv.config(); 
  process.env.NODE_ENV = process.argv[2] as Environment; // development || production

  console.log("Process =>", process.env.NODE_ENV);

  const envPath = path.resolve(__dirname, '../..');
  if (process.env.NODE_ENV === EnvironmentStates.PRODUCTION) {
    dotenv.config({ path: path.resolve(envPath, '.env.production') });
  } else {
    dotenv.config({ path: path.resolve(envPath, '.env.development') });
  }

  function DeployConfigurations (app: any, express:any) {
    const __dirname1 = path.resolve();
    const uiPath = path.join(__dirname1, '../UI/dist');
    const uiProyectPath = path.resolve(__dirname1, "..", "UI", "dist", "index.html");
    
    if(process.env.NODE_ENV === EnvironmentStates.PRODUCTION){
      app.use(express.static(uiPath));
      app.get("*", (req:Request, res:Response)=> {
        // Servimos el archivo index.html cuando se haga un request
        res.sendFile(uiProyectPath)
      })
    }
    else {
      app.get("/", (req:Request, res:Response)=>{
        res.send("API is Running Successfully");
      })
    }
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
    Deploy: DeployConfigurations,
  }
}






