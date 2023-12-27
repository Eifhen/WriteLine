import { useState } from "react";
import useGetUserImageByGUID from "../../../../hooks/useUserImage";
import IUserDTO from "../../../../models/UserModel";
import GroupChatIcon from '../../../../assets/images/group_chat_transparent.png';
import UserIcon from '../../../../assets/images/user_icon2.png';

interface IContactCard {
  admin?:IUserDTO;
  isGroupChat:boolean;
  active:string;
  operation: (base64:string) => void;
  nombre:string;
  ultimoMensaje:string;
  users:IUserDTO[];
  currentUserGUID:string;
}

export default function ChatCard(props:IContactCard){
  const { admin, users, currentUserGUID, isGroupChat, ultimoMensaje } = props;
  const [image, setImage] = useState<string>(UserIcon);
  const youAreAdmin = currentUserGUID === admin?.guid;
  const adminFullName = `${admin?.name} ${admin?.apellido}`;

  if(!isGroupChat && users.length > 0){
    const destinatario = users.filter(m => m.guid !== currentUserGUID)[0];
    if(destinatario){
      useGetUserImageByGUID(destinatario.guid!, (base64)=>{
        setImage(base64);
      },[])
    }
  }
  else {
    setImage(GroupChatIcon);
  }
  
  const renderMsg = () => {
    let msg;
    if (ultimoMensaje !== '') {
      msg = ultimoMensaje;
    } else if (ultimoMensaje === '' && isGroupChat) {
      if (youAreAdmin) {
        msg = `~ Has creado un nuevo grupo`;
      }
      msg = `~ ${adminFullName} te ha agregado a este grupo`;
    } else if (ultimoMensaje === '' && !isGroupChat) {
      msg = `~ Has iniciado una conversación con ${props.nombre}`;
    }
    return (
      <p className="text-italic" title={msg}>
        {msg}
      </p>
    );
  }

  return (
    <div className={`contact-item ${props.active}`} onClick={()=> props.operation(image)}>
      <img src={image}  alt="" />
      <div className='contact-item-info'>
        <h1 title={props.nombre}>{props.nombre}</h1>
        {renderMsg()}        
      </div>
    </div>
  )
}