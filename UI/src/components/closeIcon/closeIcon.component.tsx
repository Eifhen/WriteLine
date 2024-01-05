
interface ICloseIcon {
  operation: ()=> void;
  disable?: boolean;
  className?:string;
  sizeClass?:string;
}

export default function CloseIcon ({disable, className, sizeClass, operation}: ICloseIcon) {
  return (
    <i 
      className={`
        ri-close-line 
        text-blue800 
        pointer 
        ${sizeClass ?? 'fs-1-8'} 
        fw-thin 
        top-0 
        right-1 
        p-absolute
        ${className} 
        ${disable && 'no-click'}`
     }
      onClick={operation}
    />
  )
}