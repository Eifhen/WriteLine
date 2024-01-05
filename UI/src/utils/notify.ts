




export default function notify(msg:string, type:"success"|"error"|"info"|"warning", callback?:Function){

  const root = document.getElementById("root")!;
  const notification = document.createElement('div');
  const title = document.createElement("h1");

  notification.classList.add("notify", "move");
  title.classList.add("notify-content", type);
  notification.appendChild(title);

  title.innerText = msg;
  root.appendChild(notification);

  setTimeout(()=>{
    root.removeChild(notification);
    if(callback){
      callback();
    }
  }, 2000);  

}