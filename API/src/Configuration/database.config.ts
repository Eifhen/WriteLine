import { ConsoleBlue, ConsoleWarning } from "../Utilis/consoleColor";
import { IConfiguracion } from "./configurations";
import mongoose from "mongoose";

/** 
  Realiza la connección a la base de datos.
 */
export default function DatabaseManager (config:IConfiguracion) {
  const { connectionString }  = config;
  if(connectionString){
    connectToDataBase(connectionString, 5000);
  }
}

async function connectToDataBase(connectionString:string, retryInterval:number = 5000) {

  let retryTimer: NodeJS.Timeout | null = null
  const retryConnection = async () => {
    try {
      await mongoose.connect(connectionString);
      ConsoleWarning("Database connected");
    }
    catch(err:any){
      // si falla la connección intentalo de nuevo en x milisegundos
      console.log("Database Error =>", err);
      retryTimer = setTimeout(()=>{
        ConsoleWarning("reTrying connection...");
        connectToDataBase(connectionString, retryInterval);
      }, retryInterval);
    }
  }

  await retryConnection();

  // Limpiar el temporizador cuando la conexión sea exitosa
  if(retryTimer){
    clearInterval(retryTimer);
  }
}