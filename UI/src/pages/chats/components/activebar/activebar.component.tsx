
import { NavLink } from 'react-router-dom';
import './activebar.component.desktop.css';
import './activebar.component.movil.css';


interface IActiveBar {
  userImg?:string;

}

export default function ActiveBar (props:IActiveBar) {
  return (
    <aside className='activebar'>
      <div className="activebar-elements">
        <NavLink to="../chats" className="active-item chats">
          <i className="ri-chat-3-fill" />
        </NavLink>
      </div>
      <div className='activebar-configuration'>
        <NavLink to="../home" className='active-item fs-1-2'>
          <i className="ri-arrow-go-back-line"></i>
        </NavLink>
        
        <NavLink to="../config" className='active-item account-configuration'>
          <i className="ri-settings-3-line"/>
        </NavLink>

        <div className='user-configuration'>
          {props.userImg ? (
            <img src={props.userImg} alt="foto del usuario" />
          ): (
            <i className="ri-user-fill" />
          )}
        </div>
      </div>
    </aside>
  );
}