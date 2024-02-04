import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import FormInput from "../../../../components/FormInput/forminput.component";
import ContactLoader from "../contact_loader/contact.loader.component";
import WritelineButton   from '../../../../components/Button/Button.component';
import UserService from "../../../../services/UserService/UserService";
import notify from "../../../../utils/notify";
import CloseIcon from "../../../../components/closeIcon/closeIcon.component";
import { IChatModel, IGroupChatDTO } from "../../../../models/ChatModel";
import { formatDateToDDMMYYYY } from "../../../../utils/date.manager";
import useGroupInputs from "../../../../hooks/useGroupInput";
import EditIcon from "../../../../components/editIcon/editIcon";
import UserCard, { UserCardWithImage } from "../user_card/user.card.component";
import IUserDTO from "../../../../models/UserModel";
import HTTP from "../../../../services/HttpService/HTTPService";
import { Difference } from "../../../../utils/collection.manager";
import ChatService from "../../../../services/ChatService/chat.service";
import stringValidation from "../../../../utils/stringValidation";
import { IContactBar } from "../contacts/contact.bar.component";
import GroupChatImg from '../../../../assets/images/group_chat_transparent.png';
import UserTags from "../../../../components/UserTags/userTags.component";
import { IPanel } from "../panel/panel.component";
import objectIsNotEmpty from "../../../../utils/object_helpers";
import { IImageRecord } from "../../../../hooks/useUserImage";

export interface IChatGroupModalEditExport {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  ModalInit: (item:IChatModel) => void;
}


export interface IChatGroupModalEditProps { 
  contactItemRef?:MutableRefObject<IContactBar>;
  panelRef: MutableRefObject<IPanel>;
  currentUserGUID: string;
}

const ChatGroupModalEdit = forwardRef((props:IChatGroupModalEditProps, ref) => {
  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [userLoader, setUserLoader] = useState<boolean>(true);
  const [inputReadOnly, setInputReadOnly] = useState<boolean>(true);
  const [removedUsers, setRemovedUsers] = useState<IUserDTO[]>([]);
  const [currentUsers, setCurrentUsers] = useState<IUserDTO[]>([]);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<IUserDTO[]>([]);
  const [allUsers, setAllUsers] = useState<IUserDTO[]>([]);
  const [youAreAdmin, setYouAreAdmin] = useState<boolean>(false);
  const [adminGUID, setAdminGUID] = useState<string>("");
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false);
  const [destinatario, setDestinatario] = useState({} as IUserDTO);
  const [image, setImage] = useState<string>(GroupChatImg);
  const [userImages, setUserImages] = useState<IImageRecord>({});
  const [chatName, setChatName] = useState<string>('');
  const [chatDate, setChatDate] = useState<Date>(new Date());
  const [item, setItem] = useState<IChatModel>({} as IChatModel);

  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const inputs = useGroupInputs({
    className: `
      fw-bold title fs-1-4 bg-pure w-max-250px h-auto text-truncate 
      text-blue700 m-0 p-0 mr-1 border-0 rounded-0 fmly-secondary-font 
      ${inputReadOnly ? '' : 'border-bottom-2px mb-0-4'}
    `,
    chatName: chatName,
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
    setItem(item);
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
    if(props.panelRef?.current.activeItem){
      if(isAddingUser){
        if(selectedUsers.length > 0){
          const data:IGroupChatDTO = {
            idGroup: props.panelRef?.current?.activeItem._id!,
            name: props.panelRef?.current?.activeItem.name!,
            idUsers: selectedUsers.map(m => m._id)
          } 
          ChatService.AddUsers(props.panelRef?.current?.activeItem._id, data)
          .then(res => {
            setIsAddingUser(false);
            setCurrentUsers(res.users);
            setSelectedUsers([]);
            props?.panelRef?.current?.setActiveItem((prev) => {
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
          notify("Debes seleccionar un usuario","warning");
          setIsLoading(false);
        }
      }
      else {
        const form = event.target;
        const formData = Object.fromEntries(new FormData(form).entries());
        const groupName = stringValidation(formData.groupName, props.panelRef?.current?.activeItem.name);
       
        const data:IGroupChatDTO = {
          idGroup: props.panelRef?.current?.activeItem._id,
          name: groupName,
          idUsers: currentUsers.map(m => m._id)
        };
  
        ChatService.UpdateGroup(props.panelRef.current?.activeItem._id, data)
        .then((res)=> {
          setCurrentUsers(res.users);
          props?.panelRef?.current.setActiveItem(res);
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
  }

  const addMode = () => {
    if(removedUsers.length === 0){
      setIsAddingUser(true);
      setUserLoader(true);
      setInputReadOnly(true);
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
    else {
      notify("Has removido usuarios, guarda los cambios antes de proseguir.","warning");
    }
  }

  const detailMode = () => {
    setIsAddingUser(false);
    setSelectedUsers([]);
  }

  const deleteChat = () => {
    setIsLoading(true);
    if(props.panelRef?.current.activeItem){
      const group = props.panelRef?.current.activeItem
      ChatService.DeleteGroup(group._id)
      .then(()=> {
        notify(`El grupo <<${group.name}>> fue eliminado exitosamente!`, "success");
        props.contactItemRef?.current.setActiveChats((prev)=> {
          return prev.filter(m => m._id !== group._id);
        });
        props.panelRef?.current?.setPanelOpen(false);
      })
      .catch((err)=>{
        notify(err.message, "error");
        throw err;
      })
      .finally(()=>{
        onModalClose();
      })
    }
  }

  useImperativeHandle(ref, () : IChatGroupModalEditExport =>({
    setModal,
    ModalInit
  }));

  useEffect(()=>{
    if(item && objectIsNotEmpty(item) && objectIsNotEmpty(props.panelRef.current) && props.panelRef.current.panelOpen){
     
      setYouAreAdmin(HTTP.GetCurrentUser().data.guid === item?.groupAdmin?.guid);
      setIsGroupChat(item?.isGroupChat);
      setChatName(props?.panelRef?.current?.chatName());
      setAdminGUID(item.groupAdmin?.guid!);
      setChatDate(item.creationDate!);
      setDestinatario(
        isGroupChat ? {} as IUserDTO : 
        item?.users.filter(m => m.guid !== props.currentUserGUID)[0]!
      );
      setImage(
        isGroupChat ? GroupChatImg : 
        props?.panelRef?.current?.getImage(destinatario?.guid!)
      );
      setUserImages(
        isGroupChat ? props.panelRef.current.images :
        {}
      )
    }
  },[
    props.panelRef, 
    props.panelRef.current, 
    props.panelRef.current.panelOpen,
    isGroupChat,
    item
  ])

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
          height={isGroupChat ? "800px" : "" } 
          className={`rounded-big overflow-hidden ${isGroupChat ? '' : ''}`}
        >
          <ModalHeader className=' p-relative'>
            <CloseIcon className="top-0-6" operation={onModalClose} disable={isLoading} />
          </ModalHeader>
          <ModalBody className={`p-0  ${isLoading && 'disable-click'}`}>
            {isAddingUser ? (
              <>
                <div className="pl-2 pt-1 pb-1">
                  <div className="align-y-center text-blue400">
                    <i  onClick={detailMode} className="ri-arrow-left-line fs-1-5 mr-1 pointer hover-fade"></i>
                    <h1 className="fw-bold fs-1-2">
                      Todos los contactos
                    </h1>
                  </div>
                </div>
                <div className="pl-2 pr-2 pb-1 pt-1">
                  <UserTags 
                    users={selectedUsers} 
                    showTitle={false}
                    className="bg-blue100 text-blue800 pl-0-5 fs-10px fw-medium ls-1px" 
                  />
                  <ContactLoader isLoading={userLoader}>
                    {allUsers.length > 0 ? (
                     <>
                      {allUsers.map((u, index) => (
                        <UserCard
                          key={index} 
                          user={u}
                          isActive={isActive(u.guid!)}
                          isAdmin={u.guid === adminGUID} 
                          operation={()=>handleSelectUser(u)}
                        />
                      ))}
                     </>
                    ) : (
                      <div className="align-center rounded-big bg-gray-white h-400px">
                        <p>Por el momento no hay usuarios disponibles</p>
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
                          value={chatName}
                          {...input} 
                        />
                      ))}
                      {isGroupChat && youAreAdmin && (
                        <EditIcon className="fs-1-2 align-self-end" operation={()=> setInputReadOnly(!inputReadOnly)} />
                      )}
                    </div>
                    <p className="fs-smaller fw-bold fmly-primary-font text-blue400 m-0 p-0 ">
                      {formatDateToDDMMYYYY(chatDate, " / ")}
                    </p>
                  </div>
                </div>
                {isGroupChat ? (
                  <>
                    <div className="pl-2 pr-2 pb-1">
                      <h1 className="d-none
                        fw-bold fs-1 fmly-secondary-font ls-2px 
                        bg-blue400 text-white text-center w-150px p-0-5 mt-1 mb-1 
                        rounded-top-right-big rounded-bottom-left-big"
                      >
                        Integrantes 
                      </h1>

                      <UserTags 
                        users={removedUsers} 
                        title="Removidos"
                        showTitle={removedUsers.length > 0}
                        titleClass="mb-0-5 mt-0-5 pl-0-4 ls-1px fs-smaller text-red fw-bold fmly-secondary-font"
                        className="bg-red-palid text-red pl-0-5 fs-9px fw-bold-1 ls-1px"
                        containerClass="border-left-2px border-red pl-0-5" 
                      />

                      {youAreAdmin  && (
                        <div className={`contact-item `} onClick={addMode}>
                          <div className="w-50px h-50px bg-blue400 text-white rounded-circle align-center fs-1-3">
                            <i className="ri-user-add-line"></i>
                          </div>
                          <div className='contact-item-info'>
                            <h1 className="fw-bold text-blue400" title="Añadir Miembros">Añadir Miembros</h1>
                          </div>
                        </div>
                      )}
                      <div className="mt-0">
                        <ContactLoader isLoading={false}>
                          {currentUsers.map((u, index) => (
                            <UserCardWithImage
                              key={index} 
                              user={u}
                              image={userImages[u.guid!]}
                              isAdmin={u.guid === adminGUID} 
                              removeAction={()=>removeUser(u)} 
                              allowRemove={youAreAdmin && u.guid != adminGUID} 
                            />
                          ))}
                        </ContactLoader> 
                      </div>
                    </div>
                    {youAreAdmin && (
                      <div className="mt-2 mb-1 pl-3 pt-1 pb-1 border-top border-bottom">
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
          {isGroupChat && youAreAdmin &&( isAddingUser || removedUsers.length > 0 || !inputReadOnly) && (
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