import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import WritelineButton   from '../../../../components/Button/Button.component';
import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import IUserDTO from "../../../../models/UserModel";
import useGetAllUsers from "../../../../hooks/useAllUsers";
import UserCard from "../user_card/user.card.component";
import useGroupInputs from "../../../../hooks/useGroupInput";
import FormInput from "../../../../components/FormInput/forminput.component";
import UserService from "../../../../services/UserService/UserService";
import notify from "../../../../utils/notify";
import ContactLoader from "../contact_loader/contact.loader.component";
import { IPanel } from "../panel/panel.component";

export interface IChatGroupModalExport {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  ModalInit: () => void;
}

export interface IChatGroupModalProps {
  panelRef?: MutableRefObject<IPanel>
}

const ChatGroupModal = forwardRef((props:IChatGroupModalProps, ref) => {
  const [modal, setModal] = useState<boolean>(false);
  const [users, setUsers] = useState<IUserDTO[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLoader, setUserLoader] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const inputs = useGroupInputs();

  const ModalInit = () => {
    setModal(true);
    UserService.GetAllUsers()
    .then((res:any)=>{
      setUsers(res);
    })
    .catch((err:any)=>{
      notify(err.message, "error");
      throw err;
    })
    .finally(()=>{
      setUserLoader(false)
    })
  }

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

  function handleSubmit(event:any){
    event.preventDefault();
    const form = event.target;
    if(form.checkValidity()){
      setShowError(false);
      setIsLoading(true);
      //setIsLoading(false);
      const data = Object.fromEntries(new FormData(form).entries());
      
    }
    else {
      setShowError(true)
    }
  }

  const onModalClose = () => {
    if(isLoading == false){
      setModal(false);
      setShowError(false);
     
      setSelectedUsers([]);
      clearForm();
    }
  }

  const clearForm = () => {
    if(formRef.current){
      formRef.current.reset();
    }
  }

  useImperativeHandle(ref, () : IChatGroupModalExport =>({
    setModal,
    ModalInit
  }));

  return (
    <Modal 
      size="xl"
      isOpen={modal} 
      isCentered
      onClose={onModalClose}
      closeOnOverlayClick={isLoading ? false : true} 
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <form ref={formRef} onSubmit={handleSubmit} noValidate={true}>
        <ModalContent className='pt-1  rounded-big'>
          <ModalHeader className='text-left pl-2 pr-2 pb-1 pt-1 p-relative'>
            <i 
              className="ri-close-line text-blue800 pointer fs-1-8 fw-thin top-0 right-1 p-absolute"
              onClick={onModalClose}
            />
            <h1 className='border-left-1 border-left-blue400 text-blue800 pl-1'>
              Nuevo Grupo <br />
            </h1>
            {inputs.map((input, index)=> (
              <FormInput 
                key={index} 
                fieldClass="mt-1 fs-1 pr-0-4" 
                disabled={isLoading ? true : false} 
                showError={showError} 
                {...input} 
              />
            ))}
            {selectedUsers.length > 0 && (
              <div className="mt-1 d-flex fw-normal">
                {selectedUsers.map((u, index)=> {
                  if(index <= 2) {
                    return (
                      <small key={index} className="rounded-big p-0-5 pr-1 pl-1 mr-0-5 text-center bg-blue100 fs-smaller">
                        {u.nombre} {u.apellido}
                      </small>
                    )
                  }
                })}
                {selectedUsers.length > 3 && (
                  <small 
                    className="rounded-big p-0-5 pr-1 pl-1 text-center bg-blue100 align-center w-70px fs-smaller"
                    title={selectedUsers.map((m, index)=> {
                      if(index > 2){
                        return `${m.nombre} ${m.apellido}`;
                      }
                      return "";
                    }).join('\n')}
                  >
                    <i className="ri-add-line"></i>
                    <span className="">{selectedUsers.length - 3}</span>
                  </small>
                )}
              </div>
            )}
          </ModalHeader>
          <ModalBody className={`p-1 pl-2 pr-2 pt-0 ${isLoading && 'disable-click'}`}>
              {users.length > 0 ? (
                <> 
                  <p className="fw-normal fs-1 mb-1 text-blue600">
                    Selecciona a los participantes del grupo
                  </p>
                  <ContactLoader isLoading={userLoader}>
                    {users.map((u, index) => (
                      <UserCard
                        key={index} 
                        user={u} 
                        isActive={isActive(u.guid!)}
                        operation={()=>handleSelectUser(u)}  
                      />
                    ))}
                  </ContactLoader>
                </>
              ) : (
                <div className='text-center rounded-15 h-100 align-center'>
                  <p>Sin resultados</p>
                </div>
              )}
          </ModalBody>
          <ModalFooter className='d-flex justify-end pr-2'>
            <WritelineButton  
              className="simple bg-blue400 text-white fw-bold rounded-pill mr-0-4" 
              title="Crear Grupo"
              height='48px' 
              width='160px'
              isLoading={isLoading}
              disable={isLoading}
            />
          </ModalFooter>
        </ModalContent>
        </form>
    </Modal>
  )
})



ChatGroupModal.displayName = "ChatGroupModal";
export default ChatGroupModal;