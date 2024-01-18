import { forwardRef, useImperativeHandle, useState, useEffect, useRef, MutableRefObject } from 'react';
import Logo from '../../../../components/Logo/logo.component';
import { IContactBar } from '../contacts/contact.bar.component';
import './panel.component.desktop.css';
import './panel.component.movil.css';
import { IChatModel } from '../../../../models/ChatModel';
import ChatGroupModalEdit, { IChatGroupModalEditExport } from '../chatgroup_modal/chatgroup.modal.edit';
import MessageCard from '../message_card/message_card.component';
import getFormEntries from '../../../../utils/form.methods';
import MessageBox, { IMessageBoxExport } from '../message_box/message_box.component';
import MessageService from '../../../../services/MessageService/message.service';
import notify from '../../../../utils/notify';
import IMessageModel, { IMessageDTO } from '../../../../models/MessageModel';
import useAllMessages from '../../../../hooks/useAllMessages';
import { useGetUsersImages } from '../../../../hooks/useUserImage';


interface IPanelProps {
  contactItemRef?:MutableRefObject<IContactBar>;
  editGroupModalRef:MutableRefObject<IChatGroupModalEditExport>;
  currentUserGUID: string;
}

export interface IPanel {
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  panelOpen: boolean;
  activeItem: IChatModel
  setActiveItem: React.Dispatch<React.SetStateAction<IChatModel>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  chatName: () => string;
  getImage: (guid: string) => string;
  setRelaod: React.Dispatch<React.SetStateAction<boolean>>
}

const Panel = forwardRef((props:IPanelProps, ref) => {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState({} as IChatModel);
  const [image, setImage] = useState<string>('');
  const [messages, setMessages] = useState<IMessageModel[]>([]);
  const [msgIsLoading, setMsgIsLoading] = useState<boolean>(false);
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
    return "últ. vez hoy a la(s) 6:24 p.m."
  }

  const clearForm = () => {
    if(formRef.current){
      formRef.current.reset();
    }
  }

  const sendMessage = (event:any) => {
    event.preventDefault();
    const form = event.target;
    if(form.checkValidity()){
      const { messageBox } = getFormEntries(form);
      
      const data:IMessageDTO = {
        idChat,
        message: messageBox.toString(),
      }

      messageBoxRef.current?.setDisabled(true);
      MessageService.SendMessage(data)
      .then((res) => {
        console.log("res =>", res);
        setMessages((prev)=>([...prev, res]))
      })
      .catch(err => {
        notify(err.message,"error");
        throw err;
      })
      .finally(()=>{
        clearForm();
        messageBoxRef.current?.setDisabled(false);
        messageBoxRef?.current?.setFocus(); 
      })
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
    setRelaod
  }));

  useAllMessages(panelOpen, idChat, (data)=>{
    console.log("refetch items");
    setMessages(data);
  }, [activeItem]);

  useEffect(()=> {
    if(panelOpen){ 
      messageBoxRef?.current?.setFocus(); 
    }
  },[activeItem]);

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
          <MessageCard 
            getImage={getImage}
            messages={messages} 
            currentUserGUID={props.currentUserGUID}  
          />
        </div>
        <form ref={formRef} onSubmit={sendMessage} className='panel-footer' noValidate>
          <div className='options'>
            <div className='option-item'></div>
            <div className='option-item'></div>
          </div>
          <div className='message-area'>
            <MessageBox 
              ref={messageBoxRef}
              disabled={false} 
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