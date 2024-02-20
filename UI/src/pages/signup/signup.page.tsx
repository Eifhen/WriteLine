import { MutableRefObject, useRef, useState } from 'react';
import FormInput from '../../components/FormInput/forminput.component';
import Logo from '../../components/Logo/logo.component';
import useSignupInputs from '../../hooks/useSignupInputs';
import './signup.page.desktop.css';
import './signup.page.movil.css';
import Footer from '../../components/Footer/footer.component';
import Button from '../../components/Button/Button.component';
import SignupService from '../../services/SignupService/SignupService';
import { useNavigate } from 'react-router-dom';
import notify from '../../utils/notify';
import UserImage, { IUserImage } from '../../components/UserImage/user-image.component';

export default function SignupPage() {
 
  const formInputs = useSignupInputs();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userImageRef:MutableRefObject<IUserImage | null> = useRef(null); 

  function handleSubmit(event:any){
    event.preventDefault();
    const form = event.target;
    const userImage =  userImageRef.current?.getImage();
    if(userImage?.fileName !== ''){
      if(form.checkValidity()){
        setShowError(false);
        setIsLoading(true);
        const data = Object.fromEntries(new FormData(form).entries());
        const user = SignupService.GetModel(data, userImage);

        SignupService.Register(user)
        .then(()=> {
          notify("Registro Exitoso", "success", ()=>{
            navigate("/login");
          });
        })
        .catch((err:any) => {
          notify(err.message,"error");
          setIsLoading(false);
          throw err;
        });
      }
      else {
        setShowError(true)
      }
    }
    else {
      notify("Debes completar el formulario", "error");
    }
  }

  return (
    <div className='signup-page'>
      <div className='signup-page-header'>
        <Logo 
          size={"1.1rem"} 
          className='pointer'
          textColor='text-dark'
          iconLineSize="icon-line-navbar" 
          iconFillSize="icon-fill-navbar"
          logoLabelBackgroundColor='#f6f6f6' 
          goTo='/home'
        />
      </div>
      <div className='signup-page-body flex-column'>
        <div className='signup-title-container pb-0-5'>
          <h1 className="fs-1-5 fw-bold-1">Completa el formulario</h1>
        </div>
        <div className="signup-card">
          <div className='signup-card-intro'>
            <div className='signup-card-mask'></div>
            <div className="signup-card-intro-content">
              <h1 className='mt-1 lh-1-2'> 
                Regístrate y conéctate <br /> 
                a nuestra red
              </h1>
            </div>
          </div>
          <div className='signup-card-form'>
            <form onSubmit={handleSubmit} noValidate>
              <div className="user-circle">
                <UserImage ref={userImageRef} size="130px" />
              </div>
              <div className="row">
                {formInputs.map((input, index) => (
                  <FormInput key={index} showError={showError} {...input} />
                ))}
                <Button 
                  className="bg-blue400 text-white fw-bold " 
                  title="Registrarse"
                  height='48px' 
                  width='100%'
                  isLoading={isLoading} 
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer className="signup-page-footer" />
    </div>
  )
}
