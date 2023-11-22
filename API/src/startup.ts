/*
  En este archivo configuramos nuestro servidor de express
*/
import express  from 'express';
import Configuration from './Configuration/configurations';
import RouterManager from './Router/router.manager';
import { RequestErrorHandler } from './Configuration/error.handler.config';
import { CorsHandler } from "./Configuration/cors.cofig";
import ApiKeyManager from './Configuration/apikey.handler.config';


const server = express();
const config = Configuration();
const JsonHandler = express.json();
const ApiKeyHandler = ApiKeyManager(config);
const RouterHandler = RouterManager(config);

server.use(CorsHandler);
server.use(ApiKeyHandler)
server.use(JsonHandler);
server.use("/api", RouterHandler);
server.use(RequestErrorHandler);
  
server.listen(5000, ()=> {
  console.log(`Server Started on PORT ${config.port}`);
});

export default server;
