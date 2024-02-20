import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './contact.bar.components.desktop.css';
import './contact.bar.components.movil.css';
import { IPanel } from '../panel/panel.component';
import ChatCard from '../chat_card/chat.card.component';
import { IChatModel } from '../../../../models/ChatModel';
import useActiveChats from '../../../../hooks/useActiveChats';
import UserService from '../../../../services/UserService/UserService';
import notify from '../../../../utils/notify';
import ContactLoader from '../contact_loader/contact.loader.component';
import IUserDTO from '../../../../models/UserModel';
import UserCard from '../user_card/user.card.component';
import ChatService from '../../../../services/ChatService/chat.service';
import { IChatGroupModalExport } from '../chatgroup_modal/chatgroup.modal.add';
import { getAllMessages } from '../../../../hooks/useAllMessages';
import { WriteLineSocket } from '../../../../utils/channels.socket';
import { GroupChatOperations, joinChat } from '../../../../utils/socketOperations';
import IMessageModel from '../../../../models/MessageModel';
import { useOnMessageReceived } from '../../../../hooks/useOnMessageReceived';
import objectIsNotEmpty from '../../../../utils/object_helpers';
import useOnChatIsUpdated from '../../../../hooks/useOnChatIsUpdated';
import useJoinToAllActiveChats from '../../../../hooks/useJoinToAllActiveChats';


interface IContactBarProps {
  panelRef?: MutableRefObject<IPanel>
  chatGroupRef?:MutableRefObject<IChatGroupModalExport>
  currentUserGUID: string;
  socketServer: WriteLineSocket;
}
export interface IContactBar {
  activeItem: IChatModel;
  setActiveItem: React.Dispatch<React.SetStateAction<IChatModel>>;
  setActiveChats: React.Dispatch<React.SetStateAction<IChatModel[]>>;
  activeChats: IChatModel[];
  handleActiveItem: (item: IChatModel, base64: string) => void;
}

type SearchInput = HTMLInputElement | null;

const ContactBar = forwardRef((props:IContactBarProps,  ref) => {
  const [activeItem, setActiveItem] = useState({} as IChatModel);
  const [activeChats, setActiveChats] = useState<IChatModel[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUserDTO[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(true);

  const searchInputRef:MutableRefObject<SearchInput> = useRef(null);
  const { currentUserGUID } = props;

  const isActive = (id:string) : 'active'|'' => activeItem._id === id ? "active" : '';
  const itemIsActive = (id:string) => activeItem._id === id;
  

  const handleActiveItem = (item:IChatModel, base64:string) => {
     // se aplica para impedir re-ejecución al dar click al mismo item
    if(!itemIsActive(item._id)){
      setActiveItem({...item, hasNewMessages:false});
      setActiveChats((prev)=> {
        const find = prev.find(m => m._id === item._id);
        if(find){
          find.hasNewMessages = false;
        } 
        return [...prev];
      });

      if(props.panelRef){
        props.panelRef?.current?.setIsLoading(true);
        getAllMessages(item._id, (messages)=>{
          props.panelRef?.current?.setPanelOpen(true);
          props.panelRef?.current?.setActiveItem(item);
          props.panelRef?.current?.setMessages(messages);
          props.panelRef?.current?.setImage(base64);
          props.panelRef?.current?.setIsLoading(false); 
        })
      }
    }
  }

  const handleSearch = (event:any) => {
    const search = event.target.value;
    if(search != ''){
      setIsSearching(true);
      setIsloading(true);
      UserService.GetUsersByQuery(search)
      .then((res)=> {
        setSearchedUsers(res);
      })
     .catch((err)=>{
        notify(err.message,"error");
        throw err.message;
     })
     .finally(()=>{
      setIsloading(false);
     })
    }
    else {
      setIsSearching(false);
    }
  }

  const accessChat = (user:IUserDTO, base64:string) => {
    const idUser = user._id;
    ChatService.AccessChat(idUser)
    .then((res)=>{
      handleActiveItem(res, base64);
      const find = activeChats.find(m => m._id === res._id);
      if(!find) {
        setActiveChats((prev)=> {
          return [res, ...prev]
        })
      }
    })
    .catch((err)=>{
      notify(err.message, "error");
      throw err.message;
    })
    .finally(()=>{
      clearSearch();
    })
  }

  const clearSearch = () => {
    setIsSearching(false);
    if(searchInputRef.current){
      searchInputRef.current.value = '';
    }
  }
  
  useActiveChats((chats)=>{
    setActiveChats(chats);
    setIsloading(false);
  },[]);

  useJoinToAllActiveChats(props.socketServer, props.currentUserGUID, activeChats);

  useOnMessageReceived(props.socketServer, (receivedMessage:IMessageModel)=>{
    if(objectIsNotEmpty(props.panelRef?.current)){
      const isActive = objectIsNotEmpty(activeItem);
      const chatsAreEqual = activeItem._id === receivedMessage.chat._id;
      const updateMessages = isActive && chatsAreEqual;
      props.panelRef?.current.updateReferences(receivedMessage, updateMessages);
    }
  }, [props.socketServer, activeItem]);

 
  useOnChatIsUpdated(props.socketServer, (destinatario, updatedChat, operation)=>{
    if(objectIsNotEmpty(props.panelRef?.current) && updatedChat.isGroupChat){
      const userIsInChat = updatedChat.users.some(m => m.guid === destinatario);
      const updatedChatIsActiveItem = updatedChat._id === activeItem._id;
      
      if(operation === GroupChatOperations.ADD){
        // Si el usuario no se encuentra en el chat entonces agrega el chat a la lista de chats activos
        setActiveChats((prev)=> ([...prev, updatedChat]));
        // une al usuario al chat
        joinChat(props.socketServer, {
          chatId: updatedChat._id, 
          guid: currentUserGUID 
        });
      }

      if(operation === GroupChatOperations.UPDATE){
        if(!userIsInChat){
          // Si el usuario fue removido de un chat y ese chat ese el chat activo
          // entonces cierro el panel, envio el notify y cambio el activeItem a un objeto vacío 
  
          if(updatedChatIsActiveItem){
            props.panelRef?.current.setPanelOpen(false);
            setActiveItem({} as IChatModel);
            notify(`Has sido removido del grupo ${updatedChat.name}`,'info');
          }
  
          // Si el usuario fue removido de un chat y ese chat no es el chat activo
          // entonces simplemente actualizo los chats, removiendo dicho chat de los chats activos
          setActiveChats(prev => prev.filter(m => m._id !== updatedChat._id));
        } else {

          // Si el usuario actual no fue removido, simplemente actualiza 
          // los chats activos y el chat actual
          // si el chat actualizado es el chat activo entonces actualizo el chat activo
          if(updatedChatIsActiveItem){
            setActiveItem(updatedChat);
          }

          setActiveChats((prev)=> {
            const index = prev.findIndex((m) => m._id === updatedChat._id);
            // Si el usuario ya se encuentra en el chat lo actualiza
            if (index !== -1) {
              const updatedChats = [...prev];
              updatedChats[index] = updatedChat; // Reemplaza el chat existente con el actualizado
              return updatedChats;
            }
            // Si el usuario no se encuentra en el chat entonces agrega el chat a la lista de chats activos
            return [...prev, updatedChat];
          });
        }
      }

      if(operation === GroupChatOperations.DELETE){
        // Si el usuario fue removido de un chat y ese chat ese el chat activo
        // entonces cierro el panel, envio el notify y cambio el activeItem a un objeto vacío 

        if(updatedChatIsActiveItem){
          props.panelRef?.current.setPanelOpen(false);
          setActiveItem({} as IChatModel);
          notify(`El grupo ${updatedChat.name} ha sido eliminado`,'warning');
        }

        // Si el usuario fue removido de un chat y ese chat no es el chat activo
        // entonces simplemente actualizo los chats, removiendo dicho chat de los chats activos
        setActiveChats(prev => prev.filter(m => m._id !== updatedChat._id));
      }
    }
  },[props.socketServer, activeItem]);
  
  useImperativeHandle(ref, () : IContactBar =>({
    activeItem,
    setActiveItem,
    activeChats,
    setActiveChats,
    handleActiveItem,
  }));
  
  return (
    <>
      <div className="contactbar">
        <div className="contactbar-header">
          <div className="contactbar-options">
            <h1>Chats</h1>
            <div 
              className='new-msg' 
              title="Crear un nuevo grupo" 
              onClick={()=> props?.chatGroupRef?.current?.ModalInit()}
            >
              <i className="ri-add-line"></i>
              <i className="ri-group-fill"></i>
            </div>
          </div>
          <div className="contactbar-search">
            <span className="ri-search-line icon"></span>
            <input 
              type="text" 
              ref={searchInputRef}  
              onChange={handleSearch} 
              placeholder='Busca un chat o inicia uno nuevo.' 
            />
            {isSearching && (<span className='close-search ri-close-line' onClick={()=> clearSearch()}></span>)}
          </div>
        </div>
        <div className="contactbar-body">
          <ContactLoader isLoading={isLoading}>
            {isSearching ? (
              searchedUsers.length > 0 ? (
                searchedUsers.map((item, index)=>(
                  <UserCard 
                    key={index}
                    user={item}
                    operation={(base64)=> accessChat(item, base64)}
                  />
                ))
              ) : (
                <div className='text-center rounded-15 h-100 align-center'>
                  <p>Sin resultados</p>
                </div>
              )
            ) : (
              activeChats.length > 0 ? (
                activeChats.map((item, index) => (
                  <ChatCard 
                    key={index}
                    users={item.users}
                    nombre={item.name}
                    sender={item.latestMessage?.sender ?? {} as IUserDTO}
                    ultimoMensaje={item.latestMessage?.content ?? ""}
                    admin={item.groupAdmin} 
                    active={isActive(item._id)}
                    isGroupChat={item.isGroupChat}
                    currentUserGUID={currentUserGUID}
                    operation={(base64) => handleActiveItem(item, base64)}
                    hasNewMessage={item.hasNewMessages}
                  />
                ))
              ) : (
                <div className='text-center rounded-15 h-100 align-center'>
                  <p>Por el momento no tienes <br /> conversaciones</p>
                </div>
              )  
            )}
          </ContactLoader>
        </div>
      </div>
    </>
  )
});

ContactBar.displayName = 'ContactBar';
export default ContactBar;