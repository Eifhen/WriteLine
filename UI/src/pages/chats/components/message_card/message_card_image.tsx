import IMessageModel from "../../../../models/MessageModel"
import UserIcon from '../../../../assets/images/user_icon2.png';



interface IMessageCardImage {
  data:IMessageModel;
  image: string;
  operation?: () => void;
  withName:boolean;
}

export default function MessageCardImage (props:IMessageCardImage){
  const { image, data } = props;

  const name = props.withName ? `${data.sender.nombre} ${data.sender.apellido}` : '';

  const operation = () => {
    if(props.operation){
      props.operation();
    }
  }

  return (
    <div title={name} className="message_card_image hover-fade trans-all-0-5s pointer" onClick={operation}>
      <img src={image ?? UserIcon} alt="user image" />
    </div>
  )
}