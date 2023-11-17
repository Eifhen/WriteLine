import { MutableRefObject, forwardRef, useImperativeHandle, useState } from 'react';
import './contactbar.components.desktop.css';
import './contactbar.components.movil.css';
import { IPanel } from '../panel/panel.component';


interface IContactBarProps {
  panelRef?: MutableRefObject<IPanel>
}

export interface IContactBar {
  activeItem: number;
}

const ContactBar = forwardRef((props:IContactBarProps,  ref) => {
  const text:number[] = [1,2,3,4,5,6,7,8,9,10];
  const [activeItem, setActiveItem] = useState<number>(-1);

  const handleActiveItem = (id:number) => {
    setActiveItem(id);
    if(props.panelRef){
      props.panelRef?.current?.setPanelOpen(true);
      props.panelRef?.current?.setActiveItem(id);
    }
  }

  const isActive = (id:number) : 'active'|'' => {
    return activeItem === id ? "active" : '';
  }

  useImperativeHandle(ref, () : IContactBar =>({
    activeItem
  }));

  return (
    <div className="contactbar">
      <div className="contactbar-header">
        <div className="contactbar-options">
          <h1>Chats</h1>
          <div className='new-msg'>
            <i className="ri-quill-pen-line"></i>
          </div>
        </div>
        <div className="contactbar-search">
          <span className="ri-search-line icon"></span>
          <input type="text" placeholder='Busca un chat o inicia uno nuevo.' />
        </div>
      </div>
      <div className="contactbar-body">
        {text.map(m => (
          <div key={m} className={`contact-item ${isActive(m)}`} onClick={()=> handleActiveItem(m)}>
            <img src="" alt="" />
            <div className='contact-item-info'>
              <h1>Nombre destinatario {m}</h1>
              <p>Último mensaje {m}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

ContactBar.displayName = 'ContactBar';
export default ContactBar;