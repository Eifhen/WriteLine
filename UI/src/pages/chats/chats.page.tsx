import ContactBar, { IContactBar } from './components/contacts/contact.bar.component';
import { useRef, MutableRefObject } from 'react';
import Panel, { IPanel } from './components/panel/panel.component';
import './assets/chats.page.desktop.css';
import './assets/chats.page.movil.css';
import './assets/contact.card.desktop.css';
import './assets/contact.input.desktop.css';
import { useWriteLineContext } from '../../context/writeline.context';
import ChatGroupModal, { IChatGroupModalExport } from './components/chatgroup_modal/chatgroup.modal.add';
import ChatGroupModalEdit, { IChatGroupModalEditExport } from './components/chatgroup_modal/chatgroup.modal.edit';


export default function ChatsPage() {
  const contactRef: MutableRefObject<IContactBar> = useRef({} as IContactBar);
  const panelRef: MutableRefObject<IPanel> = useRef({} as IPanel);
  const chatGroupRef: MutableRefObject<IChatGroupModalExport> = useRef({} as IChatGroupModalExport);
  const editGroupModalRef:MutableRefObject<IChatGroupModalEditExport> = useRef({} as IChatGroupModalEditExport);
  const context = useWriteLineContext();
  const currentUserGUID = context?.userData?.guid ?? '';
  const { socketServer } = context;

  return (
    <div className='chat-page'>
      <div className="chat-contacts">
        <ContactBar 
          ref={contactRef} 
          panelRef={panelRef} 
          chatGroupRef={chatGroupRef}
          currentUserGUID={currentUserGUID}
          socketServer={socketServer}
        />
      </div>
      <div className='chat-msg-panel'>
        <Panel 
          ref={panelRef} 
          editGroupModalRef={editGroupModalRef}
          contactItemRef={contactRef} 
          currentUserGUID={currentUserGUID}
          socketServer={socketServer}
        />
      </div>

      <ChatGroupModal 
        ref={chatGroupRef} 
        panelRef={panelRef}
        contactRef={contactRef} 
      />

      <ChatGroupModalEdit 
        ref={editGroupModalRef}
        panelRef={panelRef} 
        contactItemRef={contactRef}
        currentUserGUID={currentUserGUID}
      />
    </div>
  )
}
