




export default function stringValidation(str1:any, str2:string){

  if(str1 !== null && str1 !== undefined && str1 !== ''){
    return str1.toString();
  }
  return str2;
}