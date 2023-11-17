import Logo from "../Logo/logo.component";
import './navbar.component.css';

export default function Navbar(){
  
  return(
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo 
          size={"1.1rem"} 
          className='pointer'
          textColor='text-dark'
          iconLineSize="icon-line-navbar" 
          iconFillSize="icon-fill-navbar" 
          goTo='/home'
        />
      </div>
    </nav>
  )
}