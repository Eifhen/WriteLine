import ContactBar, { IContactBar } from './components/contacts/contact.bar.component';
import { useRef, MutableRefObject, useEffect, useState } from 'react';
import Panel, { IPanel } from './components/panel/panel.component';
import './assets/chats.page.desktop.css';
import './assets/chats.page.movil.css';
import './assets/contact.card.desktop.css';
import './assets/contact.input.desktop.css';
import { useWriteLineContext } from '../../context/writeline.context';
import ChatGroupModal, { IChatGroupModalExport } from './components/chatgroup_modal/chatgroup.modal';
import ChatGroupModalEdit, { IChatGroupModalEditExport } from './components/chatgroup_modal/chatgroup.modal.edit';
import objectIsNotEmpty from '../../utils/object_helpers';


export default function ChatsPage() {
  const contactRef: MutableRefObject<IContactBar> = useRef({} as IContactBar);
  const panelRef: MutableRefObject<IPanel> = useRef({} as IPanel);
  const chatGroupRef: MutableRefObject<IChatGroupModalExport> = useRef({} as IChatGroupModalExport);
  const editGroupModalRef:MutableRefObject<IChatGroupModalEditExport> = useRef({} as IChatGroupModalEditExport);
  const context = useWriteLineContext();
  const currentUserGUID = context.userData.guid!;
  const [reload, setReload] = useState<boolean>(false);

  console.log("editRef =>", editGroupModalRef);
  console.log("panelRef =>", panelRef);

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
          editGroupModalRef={editGroupModalRef}
          contactItemRef={contactRef} 
          currentUserGUID={currentUserGUID}
        />
      </div>
      <ChatGroupModal 
        ref={chatGroupRef} 
        panelRef={panelRef}
        contactRef={contactRef} 
      />

      {objectIsNotEmpty(panelRef.current) && panelRef.current.panelOpen && (
        <ChatGroupModalEdit 
          ref={editGroupModalRef}
          panelRef={panelRef} 
          contactItemRef={contactRef}
          currentUserGUID={currentUserGUID}
        />
      )}
    </div>
  )
}
