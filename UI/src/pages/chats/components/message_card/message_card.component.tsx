import { forwardRef, useImperativeHandle } from "react";
import IMessageModel from "../../../../models/MessageModel";
import ScrollableFeed from "react-scrollable-feed";
import './message_card.component.css';
import MessageCardImage from "./message_card_image";
import { IImageRecord } from "../../../../hooks/useUserImage";



interface IMessageCard {
  messages: IMessageModel[]
  currentUserGUID: string;
  getImage: (guid:string) => string;
}

interface IMessageCardExport {
  isSameSender: () => boolean;
  isLastMessage: () => boolean;
}

const MessageCard = forwardRef((props:IMessageCard, ref) => {
  
  const { messages, currentUserGUID } = props;

  const isSameSender = (currentMessage:IMessageModel, currentMessageIndex:number ) => {
    return (
      currentMessageIndex < messages.length - 1 && 
      ( messages[currentMessageIndex + 1].sender.guid !== currentMessage.sender.guid || 
        messages[currentMessageIndex + 1].sender.guid === undefined
      ) && 
      messages[currentMessageIndex].sender.guid !== currentUserGUID
    );
  };

  const isLastMessage = (currentMessageIndex:number) => {
    return (
      currentMessageIndex === messages.length - 1 && 
      messages[messages.length - 1].sender.guid !== currentUserGUID &&
      messages[messages.length - 1].sender.guid
    )
  }

  const messageAlignment = (currentMessage:IMessageModel, currentMessageIndex:number) => {

    // if(
    //   currentMessageIndex < messages.length - 1 &&
    //   messages[currentMessageIndex + 1].sender.guid === currentMessage.sender.guid &&
    //   messages[currentMessageIndex].sender.guid !== currentUserGUID
    // ){
    //   return "ml-1";
    // }
    // else if (
    //   (currentMessageIndex < messages.length - 1 && 
    //    messages[currentMessageIndex + 1].sender.guid !== currentMessage.sender.guid &&
    //    messages[currentMessageIndex].sender.guid !== currentUserGUID) || 
    //    (currentMessageIndex === messages.length - 1 && 
    //     messages[currentMessageIndex].sender.guid !== currentUserGUID)
    // ){
    //   return "ml-0";
    // }
    // else 
    //   return "ml-auto";

    return currentMessage.sender.guid === currentUserGUID ? "align-self-end" : ''

  }

  const marginTop = (currentMessage:IMessageModel, currentMessageIndex:number) => {
    const isSame = isSameUser(currentMessage, currentMessageIndex);
    return isSame ? "mt-3px" : "mt-10px";
  }

  const isSameUser = (currentMessage:IMessageModel, currentMessageIndex:number) => {
    return currentMessageIndex > 0 && messages[currentMessageIndex - 1].sender.guid === currentMessage.sender.guid;
  }

  const cardColor = (guid:string) => {
    return guid === currentUserGUID ? "bg-green-cake " : "bg-blue400 text-blue100";
  }

  useImperativeHandle(ref, ()=>({
    isSameSender,
    isLastMessage
  } as IMessageCardExport));

  return (
    <ScrollableFeed>
      <div className="p-1 d-flex flex-column overflow-y-auto">
       {messages && messages.map((data, index)=>(
          <div className={`message_card ${messageAlignment(data, index)} ${marginTop(data, index)}`} key={index}>
            {(isSameSender(data, index) || isLastMessage(index)) && (
              <MessageCardImage 
                data={data} 
                image={props.getImage(data.sender.guid!)}
              />
            )}
            <div className={`message_card_content ${cardColor(data?.sender?.guid!)}`}>
              <p>{data.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollableFeed>
  )
})

MessageCard.displayName = "MessageCard";
export default MessageCard;