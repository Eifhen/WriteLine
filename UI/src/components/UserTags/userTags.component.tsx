import IUserDTO from "../../models/UserModel";


interface IUserTags {
  users:IUserDTO[];
  className:string;
  title?:string;
  titleClass?:string;
  containerClass?:string;
  showTitle:boolean;
}

export default function UserTags(props:IUserTags){
  return (
    <div className={`${props.containerClass}`}>  
      {props.title && props.showTitle && (
        <h1 className={`${props.titleClass}`}>
          {props.title}
        </h1>
      )}
      {props.users.length > 0 && (
        <div className="d-flex pb-0-5 fw-normal">
          {props.users.map((u, index)=> {
            if(index <= 2) {
              return (
                <small 
                  key={index} title={`${u.nombre} ${u.apellido}`} 
                  className={`rounded-big p-0-4 mr-0-4 align-center w-100px text-truncate ${props.className}`}>
                  {u.nombre} {u.apellido}
                </small>
              )
            }
          })}
          {props.users.length > 3 && (
            <small 
              className={`rounded-big p-0-4 align-center w-120px  ${props.className}`}
              title={props.users.map((m, index)=> {
                if(index > 2){
                  return `${m.nombre} ${m.apellido}`;
                }
                return "";
              }).join('\n')}
            >
              <i className="ri-add-line"></i>
              <span className="">{props.users.length - 3} seleccionados</span>
            </small>
          )}
        </div>
      )}
    </div>
  )
}