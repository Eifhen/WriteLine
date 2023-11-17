

import './error404.page.css';
import Footer from '../../components/Footer/footer.component';
import Button from '../../components/Button/Button.component';
import { useNavigate } from 'react-router-dom';



export default function Error404Page () {
  const navigate = useNavigate();

  return (
    <div className="error404-page">
      <div className="error404-content align-column-center">
        <h1>
          Error 404 
          <small>Recurso no encontrado</small>
        </h1>
        <Button
          title="Volver al inicio" 
          className='bg-blue400 text-white ' 
          operation={()=> navigate("./home")} 
        />
      </div>
      <Footer className='error404-footer' />
    </div>
  )
}