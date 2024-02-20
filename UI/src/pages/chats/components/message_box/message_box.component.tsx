import { ForwardedRef, MutableRefObject, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { WriteLineSocket } from '../../../../utils/channels.socket';
import { emitUserIsTyping, stopTypingInterval } from '../../../../utils/socketOperations';

export interface IMessageBox {
  disabled: boolean;
  sendMessage: (message: string) => void;
  socketServer: WriteLineSocket;
  selectedChatId: string;
  currentUserGUID:string;
}
export interface IMessageBoxExport {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  input: React.RefObject<HTMLInputElement>;
  setFocus: () => void;
  resetInput: () => void;
  handleEmojiMessage: (emoji: string) => void
}
interface ICursorPosition {
  start:number | null;
  end:number | null;
}

const MessageBox = memo(forwardRef((props:IMessageBox, ref:ForwardedRef<IMessageBoxExport>)=>{
  const [message, setMessage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(props.disabled);
  const [cursorPosition, setCursorPosition] = useState<ICursorPosition>({} as ICursorPosition);
  const inputRef:MutableRefObject<HTMLTextAreaElement|null> = useRef(null);
  const timerLength = 3000;
  let typingTimer: NodeJS.Timeout | null = null;
 
  const handleChange = (event:any) =>{
    setMessage(event.target.value);
    handleCursor();
    adjustTextareaHeight(); // ajusta la altura del textarea cuando el valor cambia

    emitUserIsTyping(props.socketServer, props.selectedChatId, props.currentUserGUID, true);
    stopTypingInterval(props.socketServer, props.selectedChatId, props.currentUserGUID, typingTimer, timerLength);
  }

  const handleEmojiMessage = (emoji:string) => {

    //setMessage((prev) => prev + emoji);
    const input = inputRef.current;
    if(input){
      // Esto se hace para conservar la posición del cursor al agregar el emogi
      const startPoint = cursorPosition.start ?? input.selectionStart ?? 0;
      const endPoint = cursorPosition.end ?? input.selectionEnd ?? 0;
      const newMessage = message.substring(0, startPoint) + emoji + message.substring(endPoint, message.length);
      const lastEmojiPosition = startPoint + emoji.length; 
      
      setMessage(newMessage);
      input.setSelectionRange(lastEmojiPosition, lastEmojiPosition);
     
      // la posición final del cursor será igual a la posición 
      // final más la longitud del emoji
      setCursorPosition(({
          start: lastEmojiPosition,
          end: lastEmojiPosition,
      })); 
      
      // Al agregar el emogi indicamos al receptor que el usuario está escribiendo
      emitUserIsTyping(props.socketServer, props.selectedChatId, props.currentUserGUID, true);
      stopTypingInterval(props.socketServer, props.selectedChatId, props.currentUserGUID, typingTimer, timerLength);
    }
  }

  const handleCursor = () => {
    const input = inputRef.current;
    if(input){
      setCursorPosition({
        start: input.selectionStart,
        end: input.selectionEnd
      });
    }
  }

  const setFocus = () => {
    if(inputRef.current){
      inputRef.current.focus();
      handleCursor();
    }
  }

  const onFocus = (event:any) => {
    // actualiza la posición del cursor cada vez que se le hace focus
    const input = event.target;
    input.selectionStart = cursorPosition.start;
    input.selectionEnd = cursorPosition.end;
  }

  const adjustTextareaHeight = (reset:boolean = false) => {
    if (inputRef.current) {
      if(reset) {
        inputRef.current.style.height = 'auto'; // resetea el height del input
      }
      else {
        inputRef.current.style.height = 'auto'; // Restablece la altura para recalcularla
        const computedHeight = inputRef.current.scrollHeight;
        const maxHeight = parseInt(getComputedStyle(inputRef.current).maxHeight, 10);
        inputRef.current.style.height = Math.min(computedHeight, maxHeight) + 'px'; // Aplica la altura calculada
      }
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      props.sendMessage(message);
    }
  };

  const resetInput = () => {
    setDisabled(false);
    setMessage('');
    setFocus();
    adjustTextareaHeight(true);
  }

  useEffect(() => {
    if (inputRef.current) {
      adjustTextareaHeight(); 
    }
  }, []);

  useImperativeHandle(ref,()=>({
    message,
    setMessage,
    disabled,
    setDisabled,
    input: inputRef,
    setFocus,
    handleEmojiMessage,
    resetInput
  } as IMessageBoxExport));

  return (
   <>
    <textarea
      rows={1} 
      name="messageBox" 
      ref={(input)=>{
        if(input){
          inputRef.current = input;
          input.focus();
        }
      }} 
      required={true} 
      placeholder='Escribe un mensaje.'
      onChange={handleChange}
      onMouseUp={handleCursor}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      value={message}
      disabled={ disabled }
    />
   </>
  );
}));

MessageBox.displayName = "MessageBox";
export default MessageBox;