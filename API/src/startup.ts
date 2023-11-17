/*
  En este archivo configuramos nuestro servidor de express
*/
import express  from 'express';
import Configuration from './config';
import RouterManager from './Router/router.manager';
import { RequestErrorHandler } from './Utilis/error.handler';

const config = Configuration();
const server = express();
//server.use(cors());
server.use(express.json());
server.use("/api", RouterManager);
server.use(RequestErrorHandler);
  
server.listen(5000, ()=> {
  console.log(`Server Started on PORT ${config.port}`);
});

export default server;
