import { useState } from "react";
import IUserDTO from "../../../../models/UserModel";





import UserIcon from '../../../../assets/images/user_icon2.png';
import useGetUserImageByGUID from "../../../../hooks/useUserImage";


interface ISearchedUserCard {
  operation: (base64:string) => void;
  user:IUserDTO;
}

export default function SearchedUserCard(props: ISearchedUserCard){
  const { user, operation } = props;
  const [image, setImage] = useState<string>(UserIcon);
  const fullName = `${user.nombre} ${user.apellido}`;

  useGetUserImageByGUID(user.guid!, (base64)=>{
    setImage(base64);
  },[])
  
  return (
    <div className={`contact-item `} onClick={()=> operation(image)}>
      <img src={image}  alt="" />
      <div className='contact-item-info'>
        <h1 title={fullName}>{fullName}</h1>
      </div>
    </div>
  )
}