import { useState } from "react";
import Footer from "../../components/Footer/footer.component";
import FormInput from "../../components/FormInput/forminput.component";
import Logo from "../../components/Logo/logo.component";
import useLoginInputs from "../../hooks/useLoginInputs";
import Button from '../../components/Button/Button.component';
import './login.page.desktop.css';
import './login.page.movil.css';
import { Link, useNavigate } from "react-router-dom";
import SigninService from "../../services/SigninService/SigninService";
import notify from "../../utils/notify";
import HTTP from "../../services/HttpService/HTTPService";


export default function LoginPage() {
  const formInputs = useLoginInputs();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  function handleSubmit(event:any){
    event.preventDefault();
    const form = event.target;
    if(form.checkValidity()){
      setShowError(false);
      setDisable(true);
      const data = Object.fromEntries(new FormData(form).entries());
      const model = SigninService.GetModel(data);
      SigninService.Login(model)
      .then((res:any)=>{
        const token = res.data;
        HTTP.StoreToken(token);
        notify("Bienvenido a WriteLine","success");
        navigate("/chats");
      })
      .catch((err:any)=>{
        notify(err.message,"error");
        setDisable(false);
        throw err;
      });
    }
    else {
     setShowError(true)
    }
  }
  
  return (
    <div className="login-page">
      <div className="login-page-content">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card-header">
            <Logo 
              size={"1.1rem"} 
              className='pointer'
              textColor='text-dark'
              iconLineSize="icon-line-navbar" 
              iconFillSize="icon-fill-navbar" 
              goTo='/home'
            />
          </div>
          <div className="login-card-body">
            <h1 className="fw-bold">Iniciar Sesión</h1>
            <div className="mt-2">
              {formInputs.map((input, index) => (
                <FormInput key={index} fieldClass="mt-1" showError={showError} {...input} />
              ))}
              <Button
                isLoading={disable} 
                title="Iniciar Sesión" 
                className="w-100 mt-2 fs-1 bg-blue400 text-white fw-bold"
              />
              <div className="mt-1-5 w-100 text-center">
                <p className="fw-bold text-gray-loyal fs-14px">
                  ¿No tienes una cuenta?
                  <Link className="text-blue400 ml-0-5" to="/signup">Registrarse.</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer className="login-footer" />
    </div>
  )
}
