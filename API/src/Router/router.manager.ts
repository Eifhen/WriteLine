import {Router} from 'express';
import { IConfiguracion } from '../Configuration/configurations';

import TestController  from '../Controller/TestController';
import UserController from '../Controller/UserController';
import SignUpController from '../Controller/SignUpController';
import SignInController from '../Controller/SignInController';
import AutenticationManager from '../Configuration/autentication.handler.config';


export default function RouterManager(config:IConfiguracion){

  const autentication = AutenticationManager(config);

  const router = Router();
  router.use("/test", TestController);
  router.use("/signup", SignUpController);
  router.use("/signin", SignInController);
  router.use("/user", autentication, UserController);
  
  return router;
}






