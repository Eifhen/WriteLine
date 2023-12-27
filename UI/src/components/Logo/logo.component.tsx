
import { useNavigate } from 'react-router-dom';
import './logo.component.css';

interface ILogo {
  size?: string;
  first?: string;
  second?: string;
  textColor?:string;
  className?:string;
  iconFillSize?:string;
  iconLineSize?:string;
  logoLabelBackgroundColor?:string;
  goTo: string;
  onClick?(): void;
}

export default function Logo(props: ILogo) {
  const navigate = useNavigate();

  const handleClick = () => {
    if(props.onClick){
      props.onClick();
    }
    else {
      navigate(props.goTo)
    }
  }

  return (
    <div onClick={handleClick} className={`writeline-logo lh-1 ${props.className}`}>
      <div className='logo-icon'>
        <i className={`ri-chat-3-fill ${props.iconFillSize}`}></i>
        <i className={`ri-chat-3-line ${props.iconLineSize}`}></i>
      </div>
      <div 
        className={`logo-label ${props.textColor}`} 
        style={{
          fontSize:props.size,
          backgroundColor: props?.logoLabelBackgroundColor
        }}
      >
        <span className={props.first}>Write</span>
        <span className={props.second}>Line</span>
      </div>
    </div>
  )
}

/*
  <div onClick={()=> navigate(props.goTo)} className={`writeline-logo ${props.className}`}>
        <h1 className={`writeline-logo-title ${props.textColor}`} style={{fontSize:props.size}}>
          <i style={{fontSize:props.iconSize}} className={`ri-chat-3-line ${props.first}`}></i>
          <span className={props.first}>Write</span>
          <span className={props.second}>Line</span>
        </h1>
    </div>

*/
