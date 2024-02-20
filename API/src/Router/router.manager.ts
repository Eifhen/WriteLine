import {Router} from 'express';
import { IConfiguracion } from '../Configuration/configurations';

import TestController  from '../Controller/TestController';
import UserController from '../Controller/UserController';
import SignUpController from '../Controller/SignUpController';
import SignInController from '../Controller/SignInController';
import AutenticationManager from '../Configuration/autentication.handler.config';
import ChatController  from '../Controller/ChatController';
import MessageController from '../Controller/MessageController';
import ApiKeyManager from '../Configuration/apikey.handler.config';


export default function RouterManager(config:IConfiguracion){

  const autentication = AutenticationManager(config);
  const validateApiKey = ApiKeyManager(config);
  
  const router = Router();
  router.use("/test", validateApiKey, TestController);
  router.use("/signup", validateApiKey, SignUpController);
  router.use("/signin", validateApiKey, SignInController);
  router.use("/users", validateApiKey, autentication, UserController);
  router.use("/chats", validateApiKey,  autentication, ChatController);
  router.use("/messages", validateApiKey, autentication, MessageController);
  
  return router;
}






