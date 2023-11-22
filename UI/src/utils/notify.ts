




export default function notify(msg:string, type:"success"|"error"|"info"|"warning", callback?:Function){

  const root = document.getElementById("root")!;
  const notification = document.createElement('div');
  notification.classList.add("notify", "move", type);
  notification.innerText = msg;
  root.appendChild(notification);

  setTimeout(()=>{
    root.removeChild(notification);
    if(callback){
      callback();
    }
  }, 3000);  

}