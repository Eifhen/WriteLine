import { useState } from "react";
import { IFormInput } from "../components/FormInput/forminput.component";


interface ISignupInputs {
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  confirm_password: string;
}

/*
  Esta función contiene las propiedades necesarias para renderizar y controlar los inputs
  del Signup
*/
export default function useSignupInputs () : IFormInput[] {
  const [inputs, setInputs] = useState<ISignupInputs>({
    nombre:'',
    apellido: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  function handleChange(event:any){ 
    setInputs((prev)=> ({
      ...prev, [event.target.id]: event.target.value
    }));
  }

  return [
    {
      title:'Nombre:',
      errorMessage:"El nombre de usuario debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial",
      required: true, 
      autoFocus:true,
      input:{
        type:"text",
        id:"nombre",
        name:"nombre",
        placeholder:"Introduce tu nombre",
        required: true,
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$",
        value: inputs.nombre,
        onChange: handleChange
      },
    },
    {
      title:'Apellido:',
      errorMessage:"El apellido del usuario debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial",
      required:true,
      autoFocus:true, 
      input:{
        type:"text",
        id:"apellido",
        name:"apellido",
        placeholder:"Introduce tu apellido",
        required: true,
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$",
        value: inputs.apellido,
        onChange: handleChange
      }  
    },
    {
      title:'Email:',
      required: true,
      autoFocus:true,
      errorMessage:"Ingresa un email valido", 
      input:{
        type:"email",
        id:"email",
        name:"email",
        placeholder:"Introduce tu email",
        required: true,
        value: inputs.email,
        onChange: handleChange
      } 
    },
    {
      title:'Contraseña:',
      errorMessage:"La contraseña debe ser de 5-20 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)", 
      required: true, 
      autoFocus:true,
      input:{
        type:"password",
        id:"password",
        name:"password",
        placeholder:"Introduce tu contraseña",
        required: true,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*]{5,20}$",
        value: inputs.password,
        onChange: handleChange
      }
    },
    {
      title:'Confirmar contraseña:',
      errorMessage:"las contraseñas no coinciden",
      required: true, 
      autoFocus: true,
      input:{
        type:"password",
        id:"confirm_password",
        name:"confirm_password",
        placeholder:"Confirma tu contraseña",
        required: true,
        pattern: inputs.password,
        value: inputs.confirm_password,
        onChange: handleChange
      }
    },
  ]
} 
