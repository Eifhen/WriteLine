import {Router} from 'express';
import { IConfiguracion } from '../Configuration/configurations';
import AutorizationManager from '../Configuration/autorization.handler.config';
import TestController  from '../Controller/TestController';
import UserController from '../Controller/UserController';
import SignUpController from '../Controller/SignUpController';
import SignInController from '../Controller/SignInController';


export default function RouterManager(config:IConfiguracion){

  const [autorization] = AutorizationManager(config);
  const router = Router();
  router.use("/test", TestController);
  router.use("/user", UserController);
  router.use("/signup", SignUpController);
  router.use("/signin", SignInController);
  
  return router;
}






