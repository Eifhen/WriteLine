
import { useState } from 'react';
import './forminput.component.css';


export interface IFormInput {
  input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  title: string;
  required:boolean;
  fieldClass?:string;
  errorMessage?:string;
  inputRef?: React.MutableRefObject<any>;
  autoFocus?: boolean;
  showError?:boolean;
}

export default function FormInput(props:IFormInput) {
  const [focus, setFocus] = useState<boolean>(false);

  function handleFocus(event:any){
    setFocus(true);
  }

  return (
    <fieldset className={`forminput ${props.fieldClass ?? ''}`}>
      <label htmlFor={props.input.name}>
        {props.title}
        {props.required && <span className='text-red'> *</span>}
      </label>
      <input 
        ref={props.inputRef} 
        onBlur={handleFocus} 
        onFocus={()=> props.autoFocus && setFocus(true)}
        data-focused={focus.toString()}
        data-show-error={props.showError} 
        {...props.input} 
      />
      <small className="forminput-error">{props.errorMessage}</small>
    </fieldset>
  )
}
