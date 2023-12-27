import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './contact.bar.components.desktop.css';
import './contact.bar.components.movil.css';
import { IPanel } from '../panel/panel.component';
import ChatCard from './chat.card.component';
import { IChatModel } from '../../../../models/ChatModel';
import useActiveChats from '../../../../hooks/useActiveChats';
import UserService from '../../../../services/UserService/UserService';
import notify from '../../../../utils/notify';
import ContactLoader from './contact.loader.component';
import IUserDTO from '../../../../models/UserModel';
import SearchedUserCard from './search.card.component';
import ChatService from '../../../../services/ChatService/chat.service';

interface IContactBarProps {
  panelRef?: MutableRefObject<IPanel>
  currentUserGUID: string;
}

export interface IContactBar {
  activeItem: IChatModel;
}

const ContactBar = forwardRef((props:IContactBarProps,  ref) => {
  const [activeItem, setActiveItem] = useState({} as IChatModel);
  const [activeChats, setActiveChats] = useState<IChatModel[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUserDTO[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const searchInputRef:MutableRefObject<HTMLInputElement|null> = useRef(null);
  const { currentUserGUID } = props;

  const isActive = (id:string) : 'active'|'' => {
    return activeItem._id === id ? "active" : '';
  }

  const handleActiveItem = (item:IChatModel, base64:string) => {
    setActiveItem(item);
    if(props.panelRef){
      props.panelRef?.current?.setPanelOpen(true);
      props.panelRef?.current?.setActiveItem(item);
      props.panelRef?.current?.setImage(base64);
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

  useImperativeHandle(ref, () : IContactBar =>({
    activeItem,
  }));

  useActiveChats((chats)=>{
    setActiveChats(chats);
    setIsloading(false);
  },[]);

  return (
    <div className="contactbar">
      <div className="contactbar-header">
        <div className="contactbar-options">
          <h1>Chats</h1>
          <div className='new-msg'>
            <i className="ri-quill-pen-line"></i>
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
                <SearchedUserCard 
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
                  active={isActive(item._id)}
                  isGroupChat={item.isGroupChat}
                  operation={(base64) => handleActiveItem(item, base64)}
                  ultimoMensaje=""
                  currentUserGUID={currentUserGUID}
                  admin={item.groupAdmin} 
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
  )
});

ContactBar.displayName = 'ContactBar';
export default ContactBar;