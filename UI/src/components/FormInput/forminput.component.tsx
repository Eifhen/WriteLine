
import { useEffect, useMemo, useState } from 'react';
import './forminput.component.css';


export interface IFormInput {
  input?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  title?: string;
  required?:boolean;
  fieldClass?:string;
  errorMessage?:string;
  inputRef?: React.MutableRefObject<any>;
  autoFocus?: boolean;
  showError?:boolean;
  noLabel?:boolean;
  noErrorMsg?:boolean;
  disabled?:boolean;
  onFieldSetClick?:()=> void;
  readOnly?:boolean;
  value?:any;
}

export default function FormInput({...props}:IFormInput) {
  const [focus, setFocus] = useState<boolean>(false);
  const [eye, setEye] = useState<boolean>(false);
  const eyeIcon = eye ? 'ri-eye-line' : 'ri-eye-off-line';
  const initType = useMemo(()=> props?.input?.type, []);
  const inputType = eye ? "text" : "password";
  const type = initType === "password" ? inputType : initType;
  const noLabel = props.noLabel != undefined ? props.noLabel : false;
  const noErrorMsg = props.noErrorMsg ?? true;
  const readOnly = props.readOnly ?? false;

  function handleFocus(){
    if(props.autoFocus){
      setFocus(true);
    }
  }

  function EyeHandler(){
    setEye(!eye);
  }

  useEffect(()=>{
    if(props.autoFocus){
      setFocus(true);
    }
    else {
      setFocus(false);
    }
  },[props.autoFocus]);
    
  return (
    <>
      {readOnly ? (
        <div className={`forminput `} onClick={props.onFieldSetClick}>
          {!noLabel && (
            <label htmlFor={props?.input?.id}>
              {props.title}
              {props.required && <span className='text-red'> *</span>}
            </label>
          )}
          <h1 title={props.value} className={`${props.fieldClass ?? ''}`}>
            {props.value}
          </h1>
        </div>
      ) : (
        <fieldset className={`forminput ${props.fieldClass ?? ''}`} onClick={props.onFieldSetClick}>
          {!noLabel && (
            <label htmlFor={props?.input?.id}>
              {props.title}
              {props.required && <span className='text-red'> *</span>}
            </label>
          )}
          <div className='input-wrapper' >
            <input 
              ref={props.inputRef} 
              className='forminput-input'
              onBlur={handleFocus} 
              onFocus={handleFocus}
              data-focused={focus.toString()}
              data-show-error={props.showError}
              disabled={props.disabled}
              {...props.input} 
              type={type} 
            />
            {props?.input?.type === "password" && (
              <i 
                onClick={EyeHandler} 
                className={`input-eye pointer ${eyeIcon}`}
              />
            )}
            {noErrorMsg && (
              <small className="forminput-error">{props.errorMessage}</small>
            )}
          </div>
        </fieldset>
      )}
    </>
  )
}
