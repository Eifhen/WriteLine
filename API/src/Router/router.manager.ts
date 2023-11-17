import {Router} from 'express';
import TestController  from '../Controller/TestController';
import UserController from '../Controller/UserController';


const RouterManager = Router();
RouterManager.use("/test", TestController);
RouterManager.use("/user", UserController);

export default RouterManager;






