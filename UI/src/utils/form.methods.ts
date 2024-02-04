import { MutableRefObject } from "react";







export default function getFormEntries(form:any){
  return  Object.fromEntries(new FormData(form).entries());
} 


export function resetForm(formRef:MutableRefObject<HTMLFormElement | null>){
  if(formRef && formRef.current){
    const formElements = formRef.current.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];

      if (element instanceof HTMLInputElement) {
        if (element.type !== 'submit' && element.type !== 'button' && element.type !== 'reset') {
          // Restablecer el valor del elemento
          element.setCustomValidity('');
          element.value = '';
        }
      }
    }
  }
}