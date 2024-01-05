import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import FormInput from "../../../../components/FormInput/forminput.component";
import ContactLoader from "../contact_loader/contact.loader.component";
import WritelineButton   from '../../../../components/Button/Button.component';
import { IChatGroupModalExport } from "./chatgroup.modal";
import UserService from "../../../../services/UserService/UserService";
import notify from "../../../../utils/notify";
import CloseIcon from "../../../../components/closeIcon/closeIcon.component";
import { IChatModel, IGroupChatDTO } from "../../../../models/ChatModel";
import { formatDateToDDMMYYYY } from "../../../../utils/date.manager";
import useGroupInputs from "../../../../hooks/useGroupInput";
import EditIcon from "../../../../components/editIcon/editIcon";
import UserCard from "../user_card/user.card.component";
import IUserDTO from "../../../../models/UserModel";
import HTTP from "../../../../services/HttpService/HTTPService";
import { Difference } from "../../../../utils/collection.manager";
import ChatService from "../../../../services/ChatService/chat.service";
import stringValidation from "../../../../utils/stringValidation";
import { IContactBar } from "../contacts/contact.bar.component";
import GroupChatImg from '../../../../assets/images/group_chat_transparent.png';
import GroupChatIcon from "../../../../components/groupChatIcon/groupIcon";
import UserIcon from '../../../../assets/images/user_icon2.png';

export interface IChatGroupModalEditExport {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  ModalInit: (item:IChatModel) => void;
}


export interface IChatGroupModalEditProps { 
  item: IChatModel;
  chatName:string;
  setItem: React.Dispatch<React.SetStateAction<IChatModel>>;
  contactItemRef?:MutableRefObject<IContactBar>;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserGUID: string;
}

const ChatGroupModalEdit = forwardRef((props:IChatGroupModalEditProps, ref) => {

  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [userLoader, setUserLoader] = useState<boolean>(true);
  const [inputReadOnly, setInputReadOnly] = useState<boolean>(true);
  const [removedUsers, setRemovedUsers] = useState<IUserDTO[]>([]);
  const [currentUsers, setCurrentUsers] = useState<IUserDTO[]>(props.item.users);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<IUserDTO[]>([]);
  const [allUsers, setAllUsers] = useState<IUserDTO[]>([]);
  const [image, setImage] = useState(GroupChatImg);
  const youAreAdmin = HTTP.GetCurrentUser().data.guid === props.item.groupAdmin?.guid;
  const isGroupChat = props.item.isGroupChat;
  const destinatario = isGroupChat ? 
    {} as IUserDTO : 
    props.item.users.filter(m => m.guid !== props.currentUserGUID)[0];

  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const inputs = useGroupInputs({
    className: `
      fw-bold title fs-1-4 bg-pure w-max-250px h-auto text-truncate 
      text-blue700 m-0 p-0 mr-1 border-0 rounded-0 fmly-secondary-font 
      ${inputReadOnly ? '' : 'border-bottom-2px mb-0-4'}
    `,
    chatName: props.chatName,
    formInputAttr: {
      fieldClass:`
        title fmly-secondary-font fw-bold w-max-250px 
        text-truncate text-blue700 m-0 p-0 mr-1
        ${inputReadOnly ? 'fs-1-8' : 'fs-1 bg-pure'}
      `,
      autoFocus: !inputReadOnly,
    }
  });

  const isActive = (guid:string) : 'active-blue' | 'active' |'' => {
    if(isLoading == false){
      return selectedUsers.find(m => m.guid === guid) ? "active-blue" : '';
    }
    return selectedUsers.find(m => m.guid === guid) ? "active" : '';
  }

  const handleSelectUser = (user:IUserDTO) => {
    if(isLoading == false){
      const find = selectedUsers.find(m => m.guid === user.guid);
      if(find){
        // si el usuario ya está agregado eliminalo
        setSelectedUsers(prev => {
          const filter = prev.filter(m => m.guid !== user.guid);
          return filter;
        })
      }
      else {
        // si el usuario no está agregado agregalo.
        setSelectedUsers(prev => {
          return [...prev, user];
        })
      }
    }
  }

  const removeUser = (user:IUserDTO) => {
    const find = currentUsers.find(m => m.guid === user.guid)
    if(find){
      setCurrentUsers((prevCurrentUsers) => {
        const filter = prevCurrentUsers.filter(m => m.guid !== user.guid);
        if(filter){
          return filter;
        }
        return prevCurrentUsers;
      });

      setRemovedUsers((prevRemovedUsers)=> {
        return [...prevRemovedUsers, find];
      });
    }
  }

  const ModalInit = (item:IChatModel) => {
    setModal(true);
    setCurrentUsers(item.users);
    setRemovedUsers([]);
  }

  const onModalClose = () => {
    setModal(false);
    setShowError(false);
    setIsLoading(false);
    setIsAddingUser(false);
    setInputReadOnly(true);
    setSelectedUsers([]);
    clearForm();
  }

  const clearForm = () => {
    if(formRef.current){
      formRef.current.reset();
    }
  }

  const handleSubmit = (event:any) => {
    event.preventDefault();
    setIsLoading(true);

    if(isAddingUser){
      if(selectedUsers.length > 0){
        const data:IGroupChatDTO = {
          idGroup: props.item._id,
          name: props.item.name,
          idUsers: selectedUsers.map(m => m._id)
        } 
        ChatService.AddUsers(props.item._id, data)
        .then(res => {
          setIsAddingUser(false);
          setCurrentUsers(res.users);
          setSelectedUsers([]);
          props.setItem((prev) => {
            return {...prev, users: res.users}
          })
          props.contactItemRef?.current.setActiveChats((prev)=> {
            const index = prev.findIndex((m) => m._id === res._id);
            if (index !== -1) {
              const updatedChats = [...prev];
              updatedChats[index] = res; // Reemplaza el chat existente con el actualizado
              return updatedChats;
            }
            return prev;
          });

          const msg = selectedUsers.length > 1 ? 
            "Los usuarios fueron agregados exitosamente." : 
            "El usuario fue agregado exitosamente"; 

          notify(msg,"success");
        })
        .catch(err => {
          notify(err.message,"error");
          throw err;
        })
        .finally(()=>{
          //setIsLoading(false);
          onModalClose();
        })
      }
      else {
        notify("Debes seleccionar un usuario","info");
        setIsLoading(false);
      }
    }
    else {
      const form = event.target;
      const formData = Object.fromEntries(new FormData(form).entries());
      const groupName = stringValidation(formData.groupName, props.item.name);
     
      const data:IGroupChatDTO = {
        idGroup: props.item._id,
        name: groupName,
        idUsers: currentUsers.map(m => m._id)
      };

      ChatService.UpdateGroup(props.item._id, data)
      .then((res)=> {
        setCurrentUsers(res.users);
        props.setItem(res);
        props.contactItemRef?.current.setActiveChats((prev)=> {
          const index = prev.findIndex((m) => m._id === res._id);
          if (index !== -1) {
            const updatedChats = [...prev];
            updatedChats[index] = res; // Reemplaza el chat existente con el actualizado
            return updatedChats;
          }
          return prev;
        })
        notify("El chat fue actualizado exitosamente","success");
      })
      .catch((err:any)=> {
        notify(err.message, "error");
        throw err;
      })
      .finally(()=>{
        onModalClose();
      })
    }
  }

  const addMode = () => {
    setIsAddingUser(true);
    setUserLoader(true);
     UserService.GetAllUsers()
    .then((res:any)=>{
      const data = Difference<IUserDTO>(res, currentUsers, "guid");
      setAllUsers(data);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err;
    })
    .finally(()=>{
      setUserLoader(false);
    });
  }

  const detailMode = () => {
    setIsAddingUser(false);
    setSelectedUsers([]);
  }

  const deleteChat = () => {
    setIsLoading(true);
    ChatService.DeleteGroup(props.item._id)
    .then(()=> {
      props.contactItemRef?.current.setActiveChats((prev)=> {
        return prev.filter(m => m._id !== props.item._id);
      });
      props.setPanelOpen(false);
    })
    .catch((err)=>{
      notify(err.message, "error");
      throw err;
    })
    .finally(()=>{
      onModalClose();
    })
  }

  useEffect(()=> {
    if(isGroupChat){
      setImage(GroupChatImg);
    }
    else {
      UserService.GetUserImage(destinatario.guid!)
      .then((res:any)=>{
        setImage(res.data);
      })
      .catch((err:any)=>{
        setImage(UserIcon);
        throw err.message;
      })
    }
  },[props.item])

  useImperativeHandle(ref, () : IChatGroupModalEditExport =>({
    setModal,
    ModalInit
  }));

  return (
    <Modal 
      size="lg"
      isOpen={modal} 
      isCentered
      onClose={onModalClose}
      closeOnOverlayClick={isLoading ? false : true} 
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <form ref={formRef} onSubmit={handleSubmit} noValidate={true}>
        <ModalContent 
          height={isGroupChat ? "800px" : "400px" } 
          className={`rounded-big overflow-hidden ${isGroupChat ? '' : 'bg-writeline'}`}
        >
          <ModalHeader className=' p-relative'>
            <CloseIcon className="top-0-6" operation={onModalClose} disable={isLoading} />
          </ModalHeader>
          <ModalBody className={`p-0 ${isLoading && 'disable-click'}`}>
            {isAddingUser ? (
              <>
                <div className="border-bottom pl-2 pt-1 pb-1">
                  <div className="align-y-center text-blue400">
                    <i  onClick={detailMode} className="ri-arrow-left-line fs-1-5 mr-1 pointer hover-fade"></i>
                    <h1 className="fw-bold fs-1-2">
                      Todos los contactos
                    </h1>
                  </div>
                </div>
                <div className="pl-2 pr-2 pb-1 pt-1">
                  {selectedUsers.length > 0 && (
                    <div className="d-flex pb-0-5 fw-normal">
                      {selectedUsers.map((u, index)=> {
                        if(index <= 2) {
                          return (
                            <small key={index} title={`${u.nombre} ${u.apellido}`} className="rounded-big p-0-5 pr-1 pl-1 mr-0-5 text-center bg-blue100 fs-smaller w-120px text-truncate">
                              {u.nombre} {u.apellido}
                            </small>
                          )
                        }
                      })}
                      {selectedUsers.length > 3 && (
                        <small 
                          className="rounded-big p-0-5 pr-1 pl-1 text-center bg-blue100 align-center w-150px fs-smaller"
                          title={selectedUsers.map((m, index)=> {
                            if(index > 2){
                              return `${m.nombre} ${m.apellido}`;
                            }
                            return "";
                          }).join('\n')}
                        >
                          <i className="ri-add-line"></i>
                          <span className="">{selectedUsers.length - 3} seleccionados</span>
                        </small>
                      )}
                    </div>
                  )}
                  <ContactLoader isLoading={userLoader}>
                    {allUsers.length > 0 ? (
                     <>
                      {allUsers.map((u, index) => (
                        <UserCard
                          key={index} 
                          user={u}
                          isActive={isActive(u.guid!)}
                          isAdmin={u.guid === props.item.groupAdmin?.guid} 
                          operation={()=>handleSelectUser(u)}
                        />
                      ))}
                     </>
                    ) : (
                      <div className="align-center">
                        <p>Sin Datos</p>
                      </div>
                    )}
                  </ContactLoader> 
                </div>
              </>
            ) : (
              <>
                <div className={`align-y-center  gap-1 pl-2 pb-1 pr-0 ${isGroupChat ? 'pt-1' : 'pt-1'}`}>
                  <img 
                    className="rounded-circle bg-pure align-center w-100px h-100px" 
                    src={image} alt="" 
                  />

                  <div className="">
                    <div className="d-flex">
                      {inputs.map((input, index)=> (
                        <FormInput 
                          key={index}
                          autoFocus={true} 
                          disabled={isLoading ? true : false} 
                          showError={showError}
                          readOnly={ inputReadOnly} 
                          value={props.chatName}
                          {...input} 
                        />
                      ))}
                      {isGroupChat && (
                        <EditIcon className="fs-1-2 align-self-end" operation={()=> setInputReadOnly(!inputReadOnly)} />
                      )}
                    </div>
                    <p className="fs-smaller fw-bold fmly-primary-font text-blue400 m-0 p-0 ">
                      {formatDateToDDMMYYYY(props.item.creationDate, " / ")}
                    </p>
                  </div>
                </div>
                {isGroupChat ? (
                  <>
                    <div className="pl-2 pr-2  pb-1">
                      <div className={`contact-item `} onClick={addMode}>
                        <div className="w-50px h-50px bg-blue400 text-white rounded-circle align-center fs-1-3">
                          <i className="ri-user-add-line"></i>
                        </div>
                        <div className='contact-item-info'>
                          <h1 className="fw-bold text-blue400" title="Añadir Miembros">Añadir Miembros</h1>
                        </div>
                      </div>
                      <div className="mt-0">
                        <h1 className=" d-none
                          fw-medium fmly-primary-font fs-1 mb-1 
                          bg-blue200 text-blue800 pt-0-5 pb-0-5 text-center
                          rounded-top-left-big rounded-bottom-right-big w-100"
                        >
                          Integrantes
                        </h1>
                        <ContactLoader isLoading={false}>
                          {currentUsers.map((u, index) => (
                            <UserCard
                              key={index} 
                              user={u}
                              isAdmin={u.guid === props.item.groupAdmin?.guid} 
                              removeAction={()=>removeUser(u)} 
                              allowRemove={youAreAdmin && u.guid != props.item.groupAdmin?.guid} 
                            />
                          ))}
                        </ContactLoader> 
                      </div>
                    </div>
                    {youAreAdmin && (
                      <div className="mt-2 mb-1 pl-2 pt-1 pb-1 border-top border-bottom">
                        <h2 onClick={deleteChat} className="trans-all-0-5s hover-fade text-wine fw-bold pointer">
                          <i className="ri-delete-bin-line mr-0-5 fs-1-4"></i>
                          Eliminar Grupo
                        </h2>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="pl-2 pr-2 pb-1 pt-0">
                    <div className="rounded-big  pb-1 pl-1 pr-1">
                      <ul className="list-unstyled">
                        <li className="pl-1 pb-1 pt-0-5 text-blue700 fw-bold">
                          Email: 
                          <span className="ml-0-5 fw-normal text-blue400">
                            {destinatario.email}
                          </span>
                        </li>
                        <li className="pl-1 pb-1 text-blue700 fw-bold">
                          Nombre: 
                          <span className="ml-0-5 fw-normal text-blue400">
                            {destinatario.nombre}
                          </span>
                        </li>
                        <li className="pl-1 pb-1 text-blue700 fw-bold">
                          Apellido: 
                          <span className="ml-0-5 fw-normal text-blue400">
                            {destinatario.apellido}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </ModalBody>
          {isGroupChat && (
            <ModalFooter className='d-flex justify-end pr-2 pt-0 pb-0-9'>
              <WritelineButton  
                className="simple bg-blue400 text-white fw-bold rounded-pill mr-0-4" 
                title={`${isAddingUser ? 'Agregar al grupo' : 'Guardar cambios'}`}
                height='48px' 
                width='160px'
                isLoading={isLoading}
                disable={isLoading}
              />
            </ModalFooter>
          )}
        </ModalContent>
      </form>
    </Modal>
  )
})


ChatGroupModalEdit.displayName = "ChatGroupModalEdit";
export default ChatGroupModalEdit;