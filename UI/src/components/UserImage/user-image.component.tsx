import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import './user-image.component.css';
import user_avatar from '../../assets/images/user_icon2.png';
import { IUserImageDTO } from "../../models/UserModel";
import ToBase64 from "../../utils/toBase64";

interface IUserImageProps {
  size:string;
  image?:IUserImageDTO;
  editing?:boolean;
}

export interface IUserImage {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  getImage: () => IUserImageDTO;
  setImage: React.Dispatch<React.SetStateAction<IUserImageDTO>>;
}

const UserImage = forwardRef((props:IUserImageProps, ref: React.Ref<IUserImage>) => {
  
  const [isEditing, setIsEditing] = useState<boolean>(props.editing ?? true);
  const [image, setImage] = useState<IUserImageDTO>({
    base64: props.image?.base64 ?? user_avatar,
    fileName: props.image?.fileName ?? '',
    extension: props.image?.extension ?? '',
  });

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      ToBase64(file, (base64, fileName, extension)=>{
        setImage({
          base64,
          fileName,
          extension
        });
      })  
    } else {
      setImage({
        base64: props.image?.base64 ?? user_avatar,
        fileName:'',
        extension:'',
      });
    }
  };

  useImperativeHandle(ref, ()=>({
    isEditing,
    setIsEditing,
    setImage,
    getImage: ()=> {
      return image;
    },
  } as IUserImage))

  useEffect(()=>{
    if(props.image){
      setImage(props.image);
    }
  },[props.image]);

  return (
    <div 
       className="user-image"
       style={{
        width: props.size, 
        height:props.size,
        backgroundImage:`url("${image.base64}")`
      }}
    >
      {isEditing && (
        <div className="user-image-input-container">
          <input 
            type="file" 
            className="d-none" 
            id="image" 
            name="image" 
            onChange={handleFileChange} 
          />
          <label htmlFor="image" className="user-image-icon">
            <i className="ri-camera-fill"></i>
          </label>
        </div>
      )}
    </div>
  )
});



UserImage.displayName = "UserImage";
export default UserImage;