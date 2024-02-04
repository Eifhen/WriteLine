import { ConsoleBlue, ConsoleWarning } from "../Utilis/consoleColor";
import { IConfiguracion } from "./configurations";
import mongoose from "mongoose";

/** 
  Retorna una función que realiza la connección a la base de datos.
 */
export default function DatabaseManager (config:IConfiguracion) {
  const { connectionString }  = config;
  if(connectionString){
    mongoose.connect(connectionString)
    .then(res => {
      ConsoleWarning("Database connected");
    })
    .catch((err)=>{
      console.log("Database Error =>", err);
    });
  }
}