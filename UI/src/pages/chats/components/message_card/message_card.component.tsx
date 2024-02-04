import { forwardRef, useImperativeHandle } from "react";
import IMessageModel from "../../../../models/MessageModel";
import ScrollableFeed from "react-scrollable-feed";
import './message_card.component.css';
import MessageCardImage from "./message_card_image";
import { IImageRecord } from "../../../../hooks/useUserImage";



interface IMessageCard {
  messages: IMessageModel[]
  currentUserGUID: string;
  isGroupChat: boolean;
  getImage: (guid:string) => string;
}

interface IMessageCardExport {
  isSameSender: () => boolean;
  isLastMessage: () => boolean;
}

const MessageCard = forwardRef((props:IMessageCard, ref) => {
  
  const { messages, currentUserGUID, isGroupChat } = props;

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

  const cardColor = (guid:string, section: 'card' | 'title' | 'content') => {
    if(section == 'card'){
      return guid === currentUserGUID ? "bg-blue400" : "bg-pure ";
    }
    if(section == 'title') {
      return guid === currentUserGUID ? 'text-white' : 'text-blue600';
    }
    if(section == 'content') {
      return guid === currentUserGUID ? 'text-white' : 'text-blue-royal';
    }
    return '';
  }


  useImperativeHandle(ref, ()=>({
    isSameSender,
    isLastMessage
  } as IMessageCardExport));

  return (
    <ScrollableFeed forceScroll={true} className="h-100">
      <div className="p-1 d-flex flex-column ">
       {messages && messages.map((data, index)=>(
          <div className={`message_card ${messageAlignment(data, index)} ${marginTop(data, index)}`} key={index}>
            {(isSameSender(data, index) || isLastMessage(index)) && (
              <MessageCardImage 
                data={data} 
                image={props.getImage(data.sender.guid!)}
              />
            )}
            <div className={`message_card_content d-flex flex-column ${cardColor(data?.sender?.guid!, 'card')}`}>
              {(isSameSender(data, index) && isGroupChat || isLastMessage(index) && isGroupChat) && (
                <h1 className={`fs-smaller fw-bold-1 ${cardColor(data?.sender?.guid!, 'title')}`}>
                  {data?.sender?.nombre} {data?.sender?.apellido}
                </h1>
              )}
              <p className={`${cardColor(data?.sender?.guid!, 'content')}`}>
                {data.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollableFeed>
  )
})

MessageCard.displayName = "MessageCard";
export default MessageCard;