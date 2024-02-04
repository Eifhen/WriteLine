import { IFormInput } from "../components/FormInput/forminput.component";





interface IProfileInputs {
  nombre:string;
  apellido:string;
  isReadOnly: boolean;
}

export default function useProfileInputs(props:IProfileInputs) : IFormInput[] {


  return [
    {
      title:'Nombre',
      required: true,
      errorMessage:"Debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial",
      noLabel:true,
      value: props.nombre,
      fieldClass: "fw-bold fs-1-3 text-blue700", 
      input:{
        type:"text",
        name:"nombre",
        placeholder:"Nombre",
        className: ` w-100px fw-bold text-blue700 bg-inherit h-auto rounded-0 p-0 border-0 ${props.isReadOnly || 'border-bottom-2px'}`,
        required: true,
        defaultValue: props.nombre,
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$", // solo letras, no números
        title: '',
        maxLength: 26,
      }, 
    },
    {
      title:'Apellido',
      required: true,
      errorMessage:"Debe tener entre 3-16 caracteres y no debe poseer números ni ningún caracter especial",
      noLabel:true, 
      value: props.apellido,
      fieldClass: "fw-bold fs-1-3 text-blue700",
      input:{
        type:"text",
        name:"apellido",
        placeholder:"Apellido",
        className: ` w-100px fw-bold text-blue700 bg-inherit h-auto rounded-0 p-0 border-0 ${props.isReadOnly || 'border-bottom-2px'}`,
        required: true,
        defaultValue: props.apellido,
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$", // solo letras, no números
        title: '',
        maxLength: 26,
      }, 
    },
  ]
}