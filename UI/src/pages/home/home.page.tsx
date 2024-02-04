import { useNavigate } from "react-router-dom";
import './home.page.desktop.css';
import './home.page.movil.css';
import Logo from "../../components/Logo/logo.component";
import Footer from "../../components/Footer/footer.component";
import Button from '../../components/Button/Button.component';

export default function HomePage() {
  const navigate = useNavigate();
  const toSignUp = ()=> navigate("/signup");
  const toLogIn = ()=> navigate("/login");

  return (
    <main className="home-page">
      <div className="home-page-content">
        <h2 className="title m-0 p-0 fw-bold"> 
          Bienvenido a
        </h2>
        <Logo 
          iconLineSize="icon-line" 
          iconFillSize="icon-fill"
          logoLabelBackgroundColor='#f6f6f6'  
          goTo={""} 
        />
        <div className="home-buttons">
          <Button className="mr-1" title="Registrarse" operation={()=> toSignUp()} />
          <hr />
          <Button className="bg-blue400 text-white ml-2 pl-2 pr-2" title="Ingresar" operation={()=> toLogIn()} />
        </div>
      </div>
      <Footer className="home-footer" />
    </main>
  )
}
