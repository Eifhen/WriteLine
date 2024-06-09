






export type ActivityType = 'controller' | 'service' | 'middleware';

export default function activityLog(type: ActivityType, entityName: string, entityMethod?:string, object?:any){

  if(entityMethod){
    console.log('info', `El ${type} ${entityName} ha ejecutado el metodo ${entityMethod}`, object);
  }
  else if(entityMethod === undefined){
    console.log("info", `El ${type} ${entityName} se ha ejecutado`);
  } 
}