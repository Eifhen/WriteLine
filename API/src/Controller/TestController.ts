import { Request, Response, Router, Express} from 'express';

const TestController:Router = Router();

TestController.get("/", (req:Request, res:Response)=>{
  try {
    // Lógica para obtener todos los datos
    return res.status(200).json("hola prueba");
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})

export default TestController;

