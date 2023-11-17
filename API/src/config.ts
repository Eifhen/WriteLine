const dotenv = require("dotenv");
const path = require('path');


type Environment = "development" | "production" | undefined;

export interface IConfiguracion {
  port:string | undefined;
  connectionString:string | undefined;
  enviroment: Environment;
}

export default function Configuration() : IConfiguracion {
  dotenv.config(); 
  process.env.NODE_ENV = 'development';

  const envPath = path.resolve(__dirname, '..');
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(envPath, '.env.production') });
  } else {
    dotenv.config({ path: path.resolve(envPath, '.env.development') });
  }
  
  return  {
    port: process.env.PORT,
    enviroment: process.env.NODE_ENV as Environment,
    connectionString: process.env.CONNECTION_STRING,
  }
}






