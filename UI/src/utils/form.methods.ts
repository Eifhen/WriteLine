






export default function getFormEntries(form:any){
  return  Object.fromEntries(new FormData(form).entries());
} 