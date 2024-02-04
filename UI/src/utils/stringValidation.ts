


/**
  Si str1 no es null ni undefined ni cadena vacía entonces
  retorna str1, de lo contrario retorna str2
 */
export default function stringValidation(str1:any, str2:string){

  if(str1 !== null && str1 !== undefined && str1 !== ''){
    return str1.toString();
  }
  return str2;
}