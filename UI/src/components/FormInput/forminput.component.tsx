
import { useMemo, useState } from 'react';
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
  const [eye, setEye] = useState<boolean>(false);
  const eyeIcon = eye ? 'ri-eye-line' : 'ri-eye-off-line';
  const initType = useMemo(()=> props.input.type, []);
  const inputType = eye ? "text" : "password";
  const type = initType === "password" ? inputType : initType;

  function handleFocus(event:any){
    setFocus(true);
  }

  function EyeHandler(){
    setEye(!eye);
  }

  return (
    <fieldset className={`forminput ${props.fieldClass ?? ''}`}>
      <label htmlFor={props.input.name}>
        {props.title}
        {props.required && <span className='text-red'> *</span>}
      </label>
      <div className='input-wrapper'>
        <input 
          ref={props.inputRef} 
          onBlur={handleFocus} 
          onFocus={()=> props.autoFocus && setFocus(true)}
          data-focused={focus.toString()}
          data-show-error={props.showError}
          {...props.input} 
          type={type} 
        />
        {props.input.type === "password" ? (
          <i 
            onClick={EyeHandler} 
            className={`input-eye pointer ${eyeIcon}`}
          />
        ) : (<></>)}
      </div>
      <small className="forminput-error">{props.errorMessage}</small>
    </fieldset>
  )
}
