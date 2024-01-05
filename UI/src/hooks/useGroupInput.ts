import { useState } from "react";
import { IFormInput } from "../components/FormInput/forminput.component";

interface IGroupInput {
  groupName:string;
}

interface IUseGroupInputs {
  chatName:string;
  className:string;
  inputAttr?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  formInputAttr?: IFormInput;
}
/*
  Esta función contiene las propiedades necesarias para renderizar y controlar 
  el input de nombre de grupo
*/
export default function useGroupInputs (props?:IUseGroupInputs) : IFormInput[] {
 
  return [
    {
      title:'Nombre Grupo',
      required: true,
      errorMessage:"Ingresa el nombre del grupo",
      noLabel:true, 
      input:{
        type:"text",
        name:"groupName",
        placeholder:"Nombre grupo",
        className: `
          pl-calc-1 ${props?.className}`,
        required: true,
        defaultValue: props?.chatName,
        title: props?.chatName,
        maxLength: 26,
        ...props?.inputAttr
      },
      ...props?.formInputAttr, 
    },
  ]
} 
