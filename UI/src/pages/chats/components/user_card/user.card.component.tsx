import { useState } from "react";
import IUserDTO from "../../../../models/UserModel";
import UserIcon from '../../../../assets/images/user_icon2.png';
import { IImageRecord, useGetUserImageByGUID } from "../../../../hooks/useUserImage";
import CloseIcon from "../../../../components/closeIcon/closeIcon.component";

interface ISearchedUserCard {
  operation?: (base64:string) => void;
  isActive?:string;
  isAdmin?:boolean;
  user:IUserDTO;
  removeAction?:()=> void;
  allowRemove?:boolean;
  image?:string;
}

interface UserCardImage {
  [key:string]:string;
}

export default function UserCard(props: ISearchedUserCard){
  const { user } = props;
  const [image, setImage] = useState({[user.guid!]:UserIcon} as UserCardImage);
  const fullName = `${user.nombre} ${user.apellido}`;
  const isAdmin = props.isAdmin ?? false;
  const allowRemove = props.allowRemove ?? false;

  const operation = () => {
    if(props.operation){
      props.operation(image[user.guid!]);
    }
  }

  useGetUserImageByGUID(user.guid!, (base64)=>{
    setImage(prev => ({
      ...prev, [user.guid!]: base64
    }));
  },[user])
  
  return (
    <div className={`contact-item p-relative ${props.isActive}`} onClick={()=> operation()}>
      <img src={image[user.guid!] || UserIcon}  alt="" />
      <div className='contact-item-info '>
        {isAdmin && (
          <span className="fs-small fw-bold d-inline-block rounded bg-blue300 text-white pl-0-5 pr-0-5 mb-0-2">Admin</span>
        )}
        <h1 title={fullName}>{fullName}</h1>
      </div>
        {props.removeAction && allowRemove && (
          <CloseIcon className="top-0-5" sizeClass="fs-1-2" operation={props.removeAction} />
        )}
    </div>
  )
}

export function UserCardWithImage(props: ISearchedUserCard){
  const { user } = props;
  const fullName = `${user.nombre} ${user.apellido}`;
  const isAdmin = props.isAdmin ?? false;
  const allowRemove = props.allowRemove ?? false;
  const img = props.image ?? UserIcon;

  return (
    <div className={`contact-item p-relative ${props.isActive}`}>
      <img src={img}  alt="" />
      <div className='contact-item-info '>
        {isAdmin && (
          <span className="fs-small fw-bold d-inline-block rounded bg-blue300 text-white pl-0-5 pr-0-5 mb-0-2">Admin</span>
        )}
        <h1 title={fullName}>{fullName}</h1>
      </div>
        {props.removeAction && allowRemove && (
          <CloseIcon className="top-0-5" sizeClass="fs-1-2" operation={props.removeAction} />
        )}
    </div>
  )
}