import { Request, Response, Router, Express} from 'express';
import data from "../Data/data";

const TestController:Router = Router();

TestController.get("/", (req:Request, res:Response)=>{
  try {
    // Lógica para obtener todos los datos
    return res.status(200).json(data);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})

export default TestController;



// app.get("/api/chat", (req, resp)=>{
//   resp.send({ data });  
// })

// app.get("/api/chat/:id", (req, resp)=>{
//   console.log("request =>", req.params);
// })

// app.get("/api/chat/:id/:id2", (req, resp)=>{
//   console.log("request =>", req.params);
// })


