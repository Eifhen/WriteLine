


import { useState } from 'react';
import './Button.component.css';



interface IButton {
  title:string;
  className?:string;
  operation?: () => void;
  isLoading?: boolean;
  height?:string;
  width?:string;
}

export default function Button(props:IButton){
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return(
    <button
      style={{height:props.height, width: props.width}} 
      className={`btn-writeline ${props.className}`} 
      onClick={props.operation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      autoFocus={isHovered}
      disabled={props.isLoading ?? false}
    > 
      {props.isLoading ? (
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        <>{props.title}</>
      )}
    
    </button>
  )
}