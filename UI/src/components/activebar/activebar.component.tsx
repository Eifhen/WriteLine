
import { NavLink, useNavigate } from 'react-router-dom';
import './activebar.component.desktop.css';
import './activebar.component.movil.css';
import IUserDTO from '../../models/UserModel';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { MutableRefObject, useRef, useState } from 'react';
import WritelineButton   from '../Button/Button.component';
import AutenticationService from '../../services/AutenticationService/AutenticationService';
import notify from '../../utils/notify';
import UserIcon from '../../assets/images/user_icon2.png';
import ConfigModal, { IConfigModalExport } from '../configModal/configModal.component';

interface IActiveBar {
  user:IUserDTO;
  setUserData: React.Dispatch<React.SetStateAction<IUserDTO>>;
}

export default function ActiveBar (props:IActiveBar) {

  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const configModalRef:MutableRefObject<IConfigModalExport | null> = useRef(null);
  const configBtnRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const profileBtnRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const logout = () => {
    setIsloading(true);
    setDisable(true);
    AutenticationService.LogOut(()=>{
      notify("Has cerrado sesión", "success");
      navigate("home");
    })
  }

  const onModalClose = () => {
    setShow(false);
    setIsloading(false);
    setDisable(false);
  }


  return (
    <>
      <aside className='activebar'>
        <div className="activebar-elements">
          <NavLink to="../chats" title="Chatear" className="active-item">
            <i className="ri-chat-3-fill" />
          </NavLink>
        </div>
        <div className='activebar-configuration'>
          <div onClick={()=> setShow(true)} title='Cerrar sesión' className='active-item fs-1-2'>
            <i className="ri-arrow-go-back-line"></i>
          </div>
          
          <div 
            ref={configBtnRef} 
            title="Configuraciones" 
            onClick={()=> configModalRef.current?.openModal('config')} 
            className='active-item account-configuration'
          >
            <i className="ri-settings-3-line"/>
          </div>

          <div 
            ref={profileBtnRef}  
            className='user-configuration'
            onClick={()=> configModalRef.current?.openModal('profile')}
          >
            {props.user && props.user.image && props.user.image.base64 !== '' ? (
              <img title="Ver perfil" src={props.user.image.base64} alt="foto del usuario" />
            ): (
              <img title="Ver perfil" src={UserIcon} alt="foto del usuario" />
            )}
          </div>
        </div>
      </aside>
      <Modal 
        size="lg"
        isOpen={show} 
        isCentered
        onClose={onModalClose} 
      >
        <ModalOverlay />
        <ModalContent className='pt-1 pb-1 rounded-big'>
          <ModalHeader className='text-center pt-2 pr-0 pl-0 pb-1'>
            <h1>¿Estás seguro de que deseas cerrar sesión?</h1>
          </ModalHeader>
          <ModalBody className='d-flex justify-center gap-2 p-1'>
            <WritelineButton  
              className="simple bg-blue400 text-white fw-bold rounded-pill" 
              title="Cerrar Sesión"
              height='48px' 
              width='160px'
              isLoading={isLoading}
              operation={logout}  
            />
            <WritelineButton  
              className="simple text-dark fw-bold bg-gray-light rounded-pill" 
              title="Cancelar"
              height='48px' 
              width='160px'
              isLoading={false}
              disable={disable}  
              operation={onModalClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfigModal 
        ref={configModalRef}
        configBtnRef={configBtnRef}
        profileBtnRef={profileBtnRef}
        user={ props.user } 
      />
    </>
  );
}