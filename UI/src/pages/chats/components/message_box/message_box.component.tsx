import { forwardRef, useImperativeHandle, useRef, useState } from 'react';



export interface IMessageBox {
  disabled: boolean,
}

export interface IMessageBoxExport {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  input: React.RefObject<HTMLInputElement>;
  setFocus: () => void
}

const MessageBox = forwardRef((props:IMessageBox, ref:any)=>{
  const [text, setText] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(props.disabled);
  const textInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (event:any) =>{
    setText(event.target.value);
  }

  const setFocus = () => {
    if(textInputRef.current){
      console.log("input =>", textInputRef.current.focus());
      textInputRef.current.focus();
    }
  }

  useImperativeHandle(ref,()=>({
    text,
    setText,
    disabled,
    setDisabled,
    input: textInputRef,
    setFocus
  } as IMessageBoxExport));

  return (
    <>
      <input 
        name="messageBox" 
        ref={textInputRef} 
        required={true} 
        type="text"
        placeholder='Escribe un mensaje.'
        onChange={handleChange}
        disabled={ disabled }
      />
    </>
  );
});

MessageBox.displayName = "MessageBox";
export default MessageBox;