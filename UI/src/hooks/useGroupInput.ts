import { useState } from "react";
import { IFormInput } from "../components/FormInput/forminput.component";

interface IGroupInput {
  groupName:string;
}

/*
  Esta función contiene las propiedades necesarias para renderizar y controlar 
  el input de nombre de grupo
*/
export default function useGroupInputs () : IFormInput[] {
 
  return [
    {
      title:'Nombre Grupo',
      required: true,
      autoFocus:false,
      errorMessage:"Debes ingresar el nombre del grupo",
      noLabel:true, 
      input:{
        type:"text",
        name:"groupName",
        placeholder:"Ingresa el nombre del grupo",
        className:"pl-calc-1",
        required: true,
      } 
    },
  ]
} 
