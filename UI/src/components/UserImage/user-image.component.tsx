import { forwardRef, useImperativeHandle, useState } from "react"
import './user-image.component.css';
import user_avatar from '../../assets/images/user_icon2.png';
import { IUserImageDTO } from "../../models/UserModel";
import ToBase64 from "../../utils/toBase64";

interface IUserImageProps {
  size:string;
  image?:string;
}

export interface IUserImage {
  getImage: () => IUserImageDTO;
}

const UserImage = forwardRef((props:IUserImageProps, ref: React.Ref<IUserImage>) => {
  const [image, setImage] = useState<IUserImageDTO>({
    base64: props.image ?? user_avatar,
    fileName:'',
    extension:'',
  });

  const [imgResult, setImgResult] = useState(null);

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      ToBase64(file, (base64, fileName, extension, result)=>{
        setImage({
          base64,
          fileName,
          extension
        });
        setImgResult(result)
      })  
    } else {
      setImage({
        base64: props.image ?? user_avatar,
        fileName:'',
        extension:'',
      });
      setImgResult(null);
    }
  };

  useImperativeHandle(ref, ()=>({
    getImage: ()=> {
      return image;
    },
  } as IUserImage))

  return (
    <div 
       className="user-image"
       style={{
        width: props.size, 
        height:props.size,
        backgroundImage:`url("${imgResult ?? image.base64}")`
      }}
    >
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
    </div>
  )
});



UserImage.displayName = "UserImage";
export default UserImage;