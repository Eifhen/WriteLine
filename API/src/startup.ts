/*
  En este archivo configuramos nuestro servidor de express
*/
import express  from 'express';
import Configuration from './Configuration/configurations';
import RouterManager from './Router/router.manager';
import { RequestErrorHandler } from './Configuration/error.handler.config';
import { CorsHandler } from "./Configuration/cors.cofig";
import DatabaseManager from './Configuration/database.config';
import { ConsoleWarning } from './Utilis/consoleColor';
import { createServer as createHTTPServer } from "http";
import SocketManager from './Configuration/socket.config';


async function Startup(){
  const app = express();
  const config = Configuration();
  const JsonHandler = express.json({limit:"10mb"});
  const RouterHandler = RouterManager(config);
  const server = createHTTPServer(app);
  const port = config.port!;
 
  DatabaseManager(config);
  SocketManager(server);
  
  app.use(CorsHandler);
  app.use(JsonHandler);
  app.use("/api", RouterHandler);
  app.use(RequestErrorHandler);
  
  // ---------------- DEPLOYMENT ------------------
  
  config.Deploy(app, express);
  
  // ---------------- DEPLOYMENT ------------------

  server.listen(port, ()=> {
    ConsoleWarning(`Server Started on PORT ${config.port}`);
  });
} 

Startup();