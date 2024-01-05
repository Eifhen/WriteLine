import ContactBar, { IContactBar } from './components/contacts/contact.bar.component';
import { useRef, MutableRefObject } from 'react';
import Panel, { IPanel } from './components/panel/panel.component';
import './assets/chats.page.desktop.css';
import './assets/chats.page.movil.css';
import './assets/contact.card.desktop.css';
import './assets/contact.input.desktop.css';
import { useWriteLineContext } from '../../context/writeline.context';
import ChatGroupModal, { IChatGroupModalExport } from './components/chatgroup_modal/chatgroup.modal';


export default function ChatsPage() {
  const contactRef: MutableRefObject<IContactBar> = useRef({} as IContactBar);
  const panelRef: MutableRefObject<IPanel> = useRef({} as IPanel);
  const chatGroupRef: MutableRefObject<IChatGroupModalExport> = useRef({} as IChatGroupModalExport);
  const context = useWriteLineContext();
  const currentUserGUID = context.userData.guid!;

  
  return (
    <div className='chat-page'>
      <div className="chat-contacts">
        <ContactBar 
          ref={contactRef} 
          panelRef={panelRef} 
          chatGroupRef={chatGroupRef}
          currentUserGUID={currentUserGUID} 
        />
      </div>
      <div className='chat-msg-panel'>
        <Panel 
          ref={panelRef} 
          contactItemRef={contactRef} 
          currentUserGUID={currentUserGUID}
        />
      </div>
      <ChatGroupModal 
        ref={chatGroupRef} 
        panelRef={panelRef}
        contactRef={contactRef} 
      />
    </div>
  )
}
