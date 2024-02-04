import { forwardRef, useImperativeHandle, useState, useRef, MutableRefObject } from 'react';
import Logo from '../../../../components/Logo/logo.component';
import { IContactBar } from '../contacts/contact.bar.component';
import './panel.component.desktop.css';
import './panel.component.movil.css';
import { IChatModel } from '../../../../models/ChatModel';
import { IChatGroupModalEditExport } from '../chatgroup_modal/chatgroup.modal.edit';
import MessageCard from '../message_card/message_card.component';
import getFormEntries from '../../../../utils/form.methods';
import MessageBox, { IMessageBoxExport } from '../message_box/message_box.component';
import MessageService from '../../../../services/MessageService/message.service';
import notify from '../../../../utils/notify';
import IMessageModel, { IMessageDTO } from '../../../../models/MessageModel';
import { IImageRecord, useGetUsersImages } from '../../../../hooks/useUserImage';
import ChatLoader from '../chat_loader/chat_loader';
import EmojiPicker from '../emoji_picker/emoji_picker';
import { IUseSocketServer } from '../../../../hooks/useSocketServer';

interface IPanelProps {
  contactItemRef?:MutableRefObject<IContactBar>;
  editGroupModalRef:MutableRefObject<IChatGroupModalEditExport>;
  currentUserGUID: string;
  socketServer: IUseSocketServer;
}

export interface IPanel {
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  panelOpen: boolean;
  activeItem: IChatModel
  setActiveItem: React.Dispatch<React.SetStateAction<IChatModel>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  chatName: () => string;
  getImage: (guid: string) => string;
  setRelaod: React.Dispatch<React.SetStateAction<boolean>>;
  images: IImageRecord;
  setMessages: React.Dispatch<React.SetStateAction<IMessageModel[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Panel = forwardRef((props:IPanelProps, ref) => {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState({} as IChatModel);
  const [image, setImage] = useState<string>('');
  const [messages, setMessages] = useState<IMessageModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setRelaod] = useState<boolean>(false);
  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const messageBoxRef:MutableRefObject<IMessageBoxExport | null> = useRef(null);
  const images = useGetUsersImages(activeItem, [activeItem, reload]);
  const isGroupChat = activeItem.isGroupChat;
  const idChat = activeItem._id;  


  const chatName = () => {
    if(activeItem.isGroupChat){
      return activeItem.name;
    }
    const destinatario = activeItem.users.find(m => m.guid !== props.currentUserGUID)!;
    return `${destinatario.nombre} ${destinatario?.apellido}`;
  }

  const subTitle = () => {
    if(activeItem.isGroupChat){
      return activeItem.users.map(m => `${m.nombre} ${m.apellido}`).join(", ");
    }
    return "Pulsa para obtener más info. del contacto."
  }

  const clearForm = () => {
    if(formRef.current){
      formRef.current.reset();
    }
  }

  const handleSubmit = (event:any) => {
    event.preventDefault();
    const form = event.target;
    if(form.checkValidity()){
      const { messageBox } = getFormEntries(form);
      sendMessage(messageBox.toString());
    }
  }

  const sendMessage = (message:string) => {
    if(message.trimEnd() != ''){
      const data:IMessageDTO = {
        idChat,
        message: message.trim(),
      }

      messageBoxRef.current?.setDisabled(true);
      MessageService.SendMessage(data)
      .then((res) => {
        props?.contactItemRef?.current?.setActiveItem((prev:IChatModel)=>{
          prev.latestMessage = prev.latestMessage || {} as IMessageModel;
          prev.latestMessage.content = res.content;
          prev.latestMessage.sender = res.sender;
          prev.latestMessage.chat = res.chat;
          prev.latestMessage.date = res.date;
          return {...prev};
        })
        
        props.contactItemRef?.current.setActiveChats((prev:IChatModel[]) => {
          const find =  prev.find(m => m._id === res.chat._id);
          if(find){
            find.latestMessage = find.latestMessage || {} as IMessageModel; 
            find.latestMessage.content = res.content;
            find.latestMessage.sender = res.sender;
            find.latestMessage.chat = res.chat;
            find.latestMessage.date = res.date;
          }
          return prev;
        });

        setMessages((prev)=>([...prev, res]))
      })
      .catch(err => {
        notify(err.message,"error");
        throw err;
      })
      .finally(()=>{
        clearForm();
        messageBoxRef.current?.resetInput();
      })
    }
    else {
      clearForm();
      messageBoxRef.current?.resetInput();
    }
  }

  const getImage = (guid:string) => {
    if(isGroupChat && guid) {
      return images[guid];
    }
    return image;
  }

  useImperativeHandle(ref, () : IPanel =>({
    chatName,
    setPanelOpen,
    panelOpen,
    activeItem,
    setActiveItem,
    setImage,
    getImage,
    images,
    setRelaod,
    setMessages,
    setIsLoading
  }));

  return(
    <>
    {panelOpen ? (
      <div className='panel'>
        <div className="panel-header">
          <div className='info-container' onClick={()=> props.editGroupModalRef.current.ModalInit(activeItem)}>
            <img src={image} alt="" />
            <div className="info-body">
              <h1 title={chatName()}>{chatName()}</h1>
              <p title={subTitle()} className='text-trucante w-800px text-blue800 '>{subTitle()}</p>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <ChatLoader isLoading={isLoading}>
            <MessageCard
              isGroupChat={isGroupChat} 
              getImage={getImage}
              messages={messages} 
              currentUserGUID={props.currentUserGUID}  
            />
          </ChatLoader>
        </div>
        <form className='panel-footer' ref={formRef} onSubmit={handleSubmit}  noValidate>
          <div className='options'>
            <EmojiPicker 
              messageBoxRef={messageBoxRef}
            />
          </div>
          <div className='message-area'>
            <MessageBox 
              ref={messageBoxRef}
              disabled={false}
              sendMessage={sendMessage} 
            />
          </div>
          <button className='send-btn'>
            <i className="ri-send-plane-2-fill"></i>
          </button>
        </form>
      </div>
    ) : (
      <Logo 
        className='no-click'
        iconLineSize="icon-line text-gray-light" 
        iconFillSize="icon-fill text-gray-light"
        textColor='text-gray-light bg-gray-white' 
        goTo={""} 
      />
    )}
    </>
  )
});

Panel.displayName = 'Panel';
export default  Panel;