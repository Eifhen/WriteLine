import { useEffect, useState } from "react";
import useGetUserImageByGUID from "../../../../hooks/useUserImage";
import IUserDTO from "../../../../models/UserModel";
import GroupChatIcon from '../../../../assets/images/group_chat_transparent.png';
import UserIcon from '../../../../assets/images/user_icon2.png';
import UserService from "../../../../services/UserService/UserService";
import { IChatModel } from "../../../../models/ChatModel";

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

interface ChatCardImage {
  [key:string]:string;
}

export default function ChatCard(props:IContactCard){
  const { admin, users, currentUserGUID, isGroupChat, ultimoMensaje } = props;
  const youAreAdmin = currentUserGUID === admin?.guid;
  const adminFullName = `${admin?.nombre} ${admin?.apellido}`;
  const destinatario = users.filter(m => m.guid !== currentUserGUID)[0];
  const key = destinatario?.guid ?? 'default'
  const [image, setImage] = useState({[key]:UserIcon} as ChatCardImage);


  const renderMsg = () => {
    let msg = ultimoMensaje !== '' ? ultimoMensaje
    : isGroupChat ? (youAreAdmin ? `~ Has creado el grupo ${chatName()}` : 
    `~ ${adminFullName} te ha agregado a este grupo`) : 
    `~ Has iniciado una conversación con ${chatName()}`;

    return (
      <p className="text-italic" title={msg}>
        {msg}
      </p>
    );
  }

  const chatName = () => {
    if(isGroupChat){
      return props.nombre;
    }
    const destinatario = users.find(m => m.guid !== currentUserGUID)!;
    return `${destinatario.nombre} ${destinatario?.apellido}`;
  }

  const getImage = () => {
    if(image[key]){
      return image[key];
    }
    else if(isGroupChat){
      return GroupChatIcon
    }
    else {
      return UserIcon;
    }
  }

  useEffect(()=>{
    if(isGroupChat === false && users.length > 1){
      if(destinatario){
        UserService.GetUserImage(destinatario.guid!)
        .then((res:any)=>{
          setImage(prev => ({
            ...prev, [destinatario.guid!]: res.data
          }));
        })
        .catch((err:any)=>{
          throw err.message;
        })
      }
    }
    else {
      setImage(prev => ({
        ...prev, [key]: GroupChatIcon
      }));
    }
  }, [users, currentUserGUID, isGroupChat]);

  return (
    <div className={`contact-item ${props.active}`} onClick={()=> props.operation(getImage())}>
      <img src={getImage()}  alt="" />
      <div className='contact-item-info'>
        <h1 title={chatName()}>{chatName()}</h1>
        {renderMsg()}        
      </div>
    </div>
  )
}