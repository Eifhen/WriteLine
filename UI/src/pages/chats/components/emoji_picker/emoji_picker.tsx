
import { MutableRefObject, forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import SmileFaceIcon from '../../../../components/smileFaceIcon/SmileFaceIcon';
import './emoji_picker.css';
import useOnOutsideClick from '../../../../hooks/useOnOutsideClick';
import pickerData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { IMessageBoxExport } from '../message_box/message_box.component';


interface IEmojiPickerProps {
  messageBoxRef:MutableRefObject<IMessageBoxExport | null>
}

interface IEmojiPickerExport {
  showEmoji: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmojiPicker = memo(forwardRef((props:IEmojiPickerProps, ref)=>{

  const [show, setShow] = useState<boolean>(false);
  const smileIconRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const emojiPickerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const showEmojiPicker = (state:boolean) => {
    setShow(state);
  }

  const onEmojiSelect = (emoji:any) => {
    props.messageBoxRef.current?.handleEmojiMessage(emoji.native);
  }

  useOnOutsideClick(emojiPickerRef, [smileIconRef], ()=> {
    if(show){
      showEmojiPicker(false);
    }
  },[]);

  useImperativeHandle(ref, () : IEmojiPickerExport =>({
    showEmoji: show,
    setShowEmojiPicker: setShow
  }));

  return (
    <>
      <div ref={smileIconRef} className='option-item hover-fade trans-all-0-5s' onClick={ ()=> showEmojiPicker(!show) }>
        <SmileFaceIcon />
      </div>
      <div ref={emojiPickerRef} className={`emoji-picker ${show && 'show-emoji-picker' }`}>
        <Picker
          theme="light" 
          data={pickerData} 
          onEmojiSelect={onEmojiSelect}
          previewPosition="none" 
        />
      </div>
    </>
  )
}));


EmojiPicker.displayName = 'EmojiPicker';
export default EmojiPicker;