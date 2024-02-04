
import { ForwardedRef, MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './configModal.component.css';
import IUserDTO from '../../models/UserModel';
import UserImage, { IUserImage } from '../UserImage/user-image.component';
import useProfileInputs from '../../hooks/useProfileInputs';
import FormInput from '../FormInput/forminput.component';
import WriteLineButton from '../Button/Button.component';
import EditIcon from '../editIcon/editIcon';
import { formatDateToDDMMYYYY } from '../../utils/date.manager';
import getFormEntries, { resetForm } from '../../utils/form.methods';
import UserService from '../../services/UserService/UserService';
import notify from '../../utils/notify';
import stringValidation from '../../utils/stringValidation';
import { useWriteLineContext } from '../../context/writeline.context';
import useOnOutsideClick from '../../hooks/useOnOutsideClick';
import useChangePasswordInputs from '../../hooks/useChangePasswordInputs';

interface IConfigModal {
  user:IUserDTO;
  configBtnRef: MutableRefObject<HTMLDivElement | null>;
  profileBtnRef: MutableRefObject<HTMLDivElement | null>;
}

export interface IConfigModalExport {
  closeModal: (isSaving:boolean) => void;
  openModal: (tab:IPanelConfig) => void;
}

type IPanelConfig = 'profile' | 'config';

const ConfigModal = forwardRef((props:IConfigModal, ref:ForwardedRef<IConfigModalExport>)=>{

  const context = useWriteLineContext();
  const configModalRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const profileFormRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const configFormRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
  const userImageRef:MutableRefObject<IUserImage> = useRef({} as IUserImage);
  const [inputReadOnly, setInputReadOnly] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [panel, setPanel] = useState<IPanelConfig>('profile');
  const isProfilePanel = panel === 'profile';
  const isConfigPanel = panel === 'config';
  const [configPanelInputs, resetConfigInputs] = useChangePasswordInputs();
  const profileInputs = useProfileInputs({
    nombre: props.user.nombre,
    apellido: props.user.apellido,
    isReadOnly: inputReadOnly
  });


  const editMode = () => {
    setInputReadOnly(!inputReadOnly);
    userImageRef.current.setIsEditing((prev)=> !prev);
  }

  const editProfile = (formEvent:any) => {
    formEvent.preventDefault();
    const form = formEvent.target;
    if(form.checkValidity()){
      const formData = getFormEntries(form);
      const data:IUserDTO = {
        nombre: stringValidation(formData['nombre'].toString(), props.user.nombre),
        apellido: stringValidation(formData['apellido'].toString(), props.user.apellido),
        email: props.user.email,
        password: props.user.password,
        date: props.user.date,
        image: userImageRef.current.getImage()
      }

      setDisable(true);
      UserService.UpdateUser(props.user.guid!, data)
      .then((res)=> {
        notify("Usuario actualizado exitosamente!","success");
        context.setUserData(res);
        closeModal(true);
      })
      .catch((err)=>{
        notify(err.message,"error");
        throw err;
      })
      .finally(()=>{
        setDisable(false);
      })
    }
    else {
      setShowError(true);
    }
  }

  const changePassword = (formEvent:any) => {
    formEvent.preventDefault();
    const form = formEvent.target;
    setDisable(true);
    if(form.checkValidity()){
      const formData = getFormEntries(form);
      const password =  formData['password'].toString();
      const confirmPassword = formData['confirm_password'].toString();

      if(password === confirmPassword){
        
        UserService.UpdatePassword({password})
        .then((res)=> {
          notify(res,'success');
          setDisable(false);
          closeModal(false);
        })
        .catch((err)=>{
          notify(err.message,"error");
          setDisable(false);
          throw err;
        })
      }
      else {
        notify("Las contraseñas no son iguales","error");
      }
    }
    else {
      setDisable(false);
      setShowError(true);
    }
  }

  const onTabChange = (tab:IPanelConfig) => {
    setShowError(false);
    resetConfigInputs();
    setPanel(tab);
  }

  const closeModal = (isSaving:boolean) => {
    setShow(false);
    setShowError(false);
    setDisable(false);
    setInputReadOnly(true);
    resetConfigInputs();
    userImageRef.current.setIsEditing(false);
    resetForm(configFormRef);
    
    const img = userImageRef.current.getImage();
    const imagenesDistintas = img.fileName !== props.user.image?.fileName;

    // si la imagen es distinta y no se guardo, significa que el modal
    // se cerró sin darle a guardar, por lo tanto reseteamos la imagen
    if(props.user.image && imagenesDistintas && isSaving === false){
      userImageRef.current.setImage({
        base64: props.user.image.base64!,
        extension: props.user.image.extension,
        fileName: props.user.image.fileName
      });
    }
  }

  const openModal = (tab:IPanelConfig) => {
    setPanel(tab);
    setShow(true);
  }

  useOnOutsideClick(configModalRef, [props.configBtnRef, props.profileBtnRef], ()=> {
    if(show){
      closeModal(false);
    }
  },[])

  useImperativeHandle<IConfigModalExport, IConfigModalExport>(ref, ()=>({
    closeModal,
    openModal
  }));

  return (
    <div ref={configModalRef} className={`config-modal ${show ? 'open-config-modal' : ''}`}>
      <i className="close-modal hover-fade ri-close-line" onClick={()=> closeModal(false) }></i>
      <div className='config-modal-panel'>
        <ul>
          <li className={`${isProfilePanel ? 'active' : ''}`} onClick={()=> onTabChange('profile')}>
            <i className="ri-user-3-line"></i>
            Perfil
          </li>
          <li className={`${isConfigPanel ? 'active' : ''}`} onClick={()=> onTabChange('config')}>
            <i className="ri-settings-3-line"></i>
            Configuración
          </li>
        </ul>
      </div>
      <div className='config-modal-content'>
        <div className={`config-profile ${isProfilePanel ? 'd-grid' : 'd-none'}`}>
          <div className='config-user-img'>
            <UserImage 
              ref={userImageRef} 
              size='100px' 
              image={props.user.image}
              editing={false} 
            />
          </div>
          <div className={`config-profile-content `}>
            <form className='h-100 d-flex flex-column' ref={profileFormRef} onSubmit={ editProfile }  noValidate>
              <div className='config-profile-inputs pl-1-5 pr-1-5'>
                {profileInputs.map((input, index)=> (
                  <FormInput 
                    key={index}
                    autoFocus={true} 
                    disabled={false} 
                    showError={showError}
                    readOnly={ inputReadOnly} 
                    {...input} 
                  />
                ))}
                <EditIcon className="fs-1-2" operation={ editMode } />
              </div>
              <div className='mt-1 mb-0-5 pl-1 pr-1'>
                <div className='bg-blue100 rounded-15 pt-0-5 pb-1 pr-1 pl-1'>
                  <div className='mt-1 d-flex text-blue700 fs-13px '>
                    <span className='fw-bold mr-1'>Email:</span> 
                    <span className='fw-bold text-blue400 ml-auto mr-1 d-block'>{props.user.email}</span>
                  </div>
                  { props.user.date && (
                    <div className='d-flex mt-1 text-blue700 fs-13px '>
                      <span className='fw-bold  mr-1'>Creado:</span> 
                      <span className='fw-bold text-blue400 ml-auto mr-1 d-block'>
                        {formatDateToDDMMYYYY(props.user.date, '/')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {!inputReadOnly && (
                <WriteLineButton 
                  title="Guardar"
                  isLoading={disable}
                  disable={disable}
                  className='
                    mt-auto mb-0-5 ml-auto mr-1 ptb-0-8 w-120px
                    rounded-big bg-blue400 text-white fs-12px fw-bold w-auto'
                />
              )}
            </form>
          </div>
        </div>
        <div className={`config-panel ${isConfigPanel ? 'd-grid' : 'd-none'}`}>
          <div className='config-panel-title'>
            <h1 className=''>
              Cambiar <br /> 
              Contraseña
            </h1>
          </div>
          <div className='config-panel-content'>
            <form className='h-100 d-flex flex-column' ref={configFormRef} onSubmit={ changePassword } noValidate>
              {configPanelInputs.map((input, index)=> (
                <FormInput 
                  key={index}
                  disabled={false} 
                  showError={showError}
                  {...input} 
                />
              ))}
               <WriteLineButton 
                  title="Guardar"
                  isLoading={disable}
                  disable={disable}
                  className='
                    mt-auto mb-0-5 ml-auto mr-1 ptb-0-8 w-120px
                    rounded-big bg-blue400 text-white fs-12px fw-bold w-auto'
                />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
});

ConfigModal.displayName = "ConfigModal"
export default ConfigModal;
