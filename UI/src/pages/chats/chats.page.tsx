import ActiveBar from './components/activebar/activebar.component';
import ContactBar, { IContactBar } from './components/contacts/contactbar.component';
import { useRef, MutableRefObject, useEffect } from 'react';
import Panel, { IPanel } from './components/panel/panel.component';
import './assets/chats.page.desktop.css';
import './assets/chats.page.movil.css';
import TestService from '../../services/TestService/TestService';

export default function ChatsPage() {
  const contactRef: MutableRefObject<IContactBar> = useRef({} as IContactBar);
  const panelRef: MutableRefObject<IPanel> = useRef({} as IPanel);

  useEffect(()=> {
    TestService.GetUsers()
    .then((res)=>{
      console.log("data =>", res);
    })
    .catch((err)=>{
      console.log("err =>", err);
      throw err;
    });
  },[]);

  return (
    <div className='chat-page'>
      <div className="chat-bar">
        <ActiveBar />
      </div>
      <div className="chat-contacts">
        <ContactBar ref={contactRef} panelRef={panelRef} />
      </div>
      <div className='chat-msg-panel'>
        <Panel ref={panelRef} contactItemRef={contactRef} />
      </div>
    </div>
  )
}
