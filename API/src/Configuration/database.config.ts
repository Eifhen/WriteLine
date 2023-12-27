import { IConfiguracion } from "./configurations";
import mongoose from "mongoose";

/** 
  Retorna una función que realiza la connección a la base de datos.
 */
export default function DatabaseManager (config:IConfiguracion) {
  const connectionString  = config.connectionString ?? '';

  return () => {
    return mongoose.connect(connectionString);
  }
}