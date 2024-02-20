





export default function objectIsNotEmpty(object:any){
  if(object){
    return Object.keys(object).length > 0;
  }
  return false;
}