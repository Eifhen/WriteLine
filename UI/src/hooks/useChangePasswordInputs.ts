import { useState } from "react";
import { IFormInput } from "../components/FormInput/forminput.component";




export interface IChangePasswordInputs {
  password: string,
  confirm_password: string;
}

export default function useChangePasswordInputs () : [IFormInput[], ()=> void]{
  const [autoFocus, setAutoFocus] = useState<boolean>(false);
  const [state, setState] = useState<IChangePasswordInputs>({
    password: '',
    confirm_password: ''
  })

  function handleChange(event:any){
    if(!autoFocus){
      setAutoFocus(true);
    } 
    setState((prev)=> ({
      ...prev, [event.target.name]: event.target.value
    }));
  }

  function resetInputs() {
    setAutoFocus(false);
    setState(prev => ({
      password: '',
      confirm_password: '',
    }))
  }

  const inputs = [
    {
      title:'Contraseña',
      required: true,
      errorMessage:"La contraseña debe ser de 5-20 caracteres y debe incluir por lo menos 1 letra, 1 número y un caracter especial (exceptuando al caracter $)",
      noLabel:false,
      fieldClass: "fw-bold fs-smaller text-blue700 mb-1 ",
      autoFocus: autoFocus, 
      input:{
        type:"password",
        name:"password",
        placeholder:"Ingresa una contraseña nueva",
        className: `bg-inherit `,
        required: true,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*]{5,20}$", // solo letras, no números
        value:state.password,
        onChange: handleChange,
      }, 
    },
    {
      title:'Confirmar contraseña',
      required: true,
      errorMessage:"Las contraseñas no coinciden",
      noLabel: false,
      fieldClass: "fw-bold fs-smaller text-blue700",
      autoFocus: autoFocus, 
      input:{
        type:"password",
        name:"confirm_password",
        placeholder:"Confirma la nueva contraseña",
        className: `bg-inherit `,
        required: true,
        pattern: state.password,
        value: state.confirm_password,
        onChange: handleChange,
      }, 
    },
  ];

  return [inputs, resetInputs];
}