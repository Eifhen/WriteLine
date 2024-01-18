import { IImageRecord, useUserImage } from "../../../../hooks/useUserImage";
import IMessageModel from "../../../../models/MessageModel"




interface IMessageCardImage {
  data:IMessageModel;
  image: string
}

export default function MessageCardImage (props:IMessageCardImage){
  const { image } = props;

  return (
    <div className="message_card_image">
      <img src={image} alt="user image" />
    </div>
  )
}