import ActiveBar from './components/activebar/activebar.component';
import ContactBar, { IContactBar } from './components/contacts/contactbar.component';
import { useRef, MutableRefObject } from 'react';
import Panel, { IPanel } from './components/panel/panel.component';
import './assets/chats.page.desktop.css';
import './assets/chats.page.movil.css';

export default function ChatsPage() {
  const contactRef: MutableRefObject<IContactBar> = useRef({} as IContactBar);
  const panelRef: MutableRefObject<IPanel> = useRef({} as IPanel);

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
