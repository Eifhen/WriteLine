








interface IEditIcon {
  operation: () => void;
  className?: string;
}

export default function EditIcon(props:IEditIcon){
  return (
    <i 
      className={`ri-pencil-fill text-blue400 hover-fade pointer trans-all-0-5s ${props.className}`}
      onClick={props.operation}
    />
  )
}