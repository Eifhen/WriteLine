/*
  En este archivo configuramos nuestro servidor de express
*/
import express  from 'express';
import Configuration from './Configuration/configurations';
import RouterManager from './Router/router.manager';
import { RequestErrorHandler } from './Configuration/error.handler.config';
import { CorsHandler } from "./Configuration/cors.cofig";
import ApiKeyManager from './Configuration/apikey.handler.config';
import DatabaseManager from './Configuration/database.config';
import { ConsoleWarning } from './Utilis/consoleColor';

async function Startup(){
  const server = express();
  const config = Configuration();
  const JsonHandler = express.json({limit:"10mb"});
  const ApiKeyHandler = ApiKeyManager(config);
  const RouterHandler = RouterManager(config);
  const DatabaseHandler = DatabaseManager(config);
  
  server.use(CorsHandler);
  server.use(ApiKeyHandler)
  server.use(JsonHandler);
  server.use("/api", RouterHandler);
  server.use(RequestErrorHandler);
    
  await DatabaseHandler();

  server.listen(5000, ()=> {
    ConsoleWarning(`Server Started on PORT ${config.port}`);
  });
} 

Startup();