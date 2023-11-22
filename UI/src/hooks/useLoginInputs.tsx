import { useState } from "react";
import { IFormInput } from "../components/FormInput/forminput.component";


interface ILoginInputs {
  email:string;
  password: string;
}

/*
  Esta función contiene las propiedades necesarias para renderizar y controlar los inputs
  del Login
*/
export default function useLoginInputs () : IFormInput[] {
  const [inputs, setInputs] = useState<ILoginInputs>({
    email: '',
    password: '',
  });

  function handleChange(event:any){ 
    setInputs((prev)=> ({
      ...prev, [event.target.name]: event.target.value
    }));
  }

  return [
    {
      title:'Email',
      required: true,
      autoFocus:true,
      errorMessage:"Ingresa un email valido", 
      input:{
        type:"email",
        name:"email",
        placeholder:"Introduce tu email",
        required: true,
        value: inputs.email,
        onChange: handleChange
      } 
    },
    {
      title:'Contraseña',
      errorMessage:"La contraseña debe ser de 5-20 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)", 
      required: true, 
      autoFocus:true,
      input:{
        type:"password",
        name:"password",
        placeholder:"Introduce tu contraseña",
        required: true,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*]{5,20}$",
        value: inputs.password,
        onChange: handleChange
      }
    },
  ]
} 
