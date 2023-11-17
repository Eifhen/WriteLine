import { useState } from 'react';
import FormInput from '../../components/FormInput/forminput.component';
import Logo from '../../components/Logo/logo.component';
import useSignupInputs from '../../hooks/useSignupInputs';
import './signup.page.desktop.css';
import './signup.page.movil.css';
import Footer from '../../components/Footer/footer.component';
import Button from '../../components/Button/Button.component';

export default function SignupPage() {
 
  const formInputs = useSignupInputs();
  const [showError, setShowError] = useState<boolean>(false);

  function handleSubmit(event:any){
    event.preventDefault();
    const form = event.target;
    if(form.checkValidity()){
      setShowError(false);
      const data = Object.fromEntries(new FormData(form).entries());
      // request
    }
    else {
      //alert("Invalid");
      setShowError(true)
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
          goTo='/home'
        />
      </div>
      <div className='signup-page-body'>
        <div className="signup-card">
          <div className='signup-card-intro'>
            <div className='signup-card-mask'></div>
            <div className="signup-card-intro-content">
              <h1> 
                Regístrate y conéctate a <br /> 
                nuestra red
              </h1>
            </div>
          </div>
          <div className='signup-card-form'>
            <form onSubmit={handleSubmit} noValidate>
              <h1>Completa el formulario</h1>
              <div className="row">
                {formInputs.map((input, index) => (
                  <FormInput key={index} showError={showError} {...input} />
                ))}
              </div>
              <Button className="bg-blue400 text-white fw-bold" title="Registrarse" />
            </form>
          </div>
        </div>
      </div>
      <Footer className="signup-page-footer" />
    </div>
  )
}
