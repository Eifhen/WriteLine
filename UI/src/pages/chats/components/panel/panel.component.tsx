import { forwardRef, useImperativeHandle, useState, useEffect, useRef, MutableRefObject } from 'react';
import Logo from '../../../../components/Logo/logo.component';
import { IContactBar } from '../contacts/contactbar.component';
import './panel.component.desktop.css';
import './panel.component.movil.css';


interface IPanelProps {
  contactItemRef?:MutableRefObject<IContactBar>;
}

export interface IPanel {
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  panelOpen: boolean;
  setActiveItem: React.Dispatch<React.SetStateAction<number>>;
}

const Panel = forwardRef((props:IPanelProps, ref) => {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const textInputRef = useRef<HTMLInputElement>(null);
  
  useImperativeHandle(ref, () : IPanel =>({
    setPanelOpen,
    panelOpen,
    setActiveItem
  }));

  useEffect(()=> {
    if(panelOpen){ textInputRef?.current?.focus(); }
  },[activeItem]);


  return(
    <>
    {panelOpen ? (
      <div className='panel'>
        <div className="panel-header">
          <div className='info-container'>
            <img src="" alt="" />
            <div className="info-body">
              <h1>Nombre destinatario {activeItem}</h1>
              <p>últ. vez hoy a la(s) 6:24 p.m.</p>
            </div>
          </div>
        </div>
        <div className="panel-body">

        </div>
        <div className='panel-footer'>
          <div className='options'>
            <div className='option-item'></div>
            <div className='option-item'></div>
          </div>
          <div className='message-area'>
            <input ref={textInputRef} type="textarea" placeholder='Escribe un mensaje.'/>
          </div>
          <button className='send-btn'>
            <i className="ri-send-plane-2-fill"></i>
          </button>
        </div>
      </div>
    ) : (
      <Logo 
        className='no-click'
        iconLineSize="icon-line text-gray-light" 
        iconFillSize="icon-fill text-gray-light"
        textColor='text-gray-light bg-gray-white' 
        goTo={""} 
      />
    )}
    </>
  )
});

Panel.displayName = 'Panel';
export default  Panel;