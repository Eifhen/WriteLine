import { Skeleton, Spinner, Stack } from "@chakra-ui/react";



interface IChatLoader {
  isLoading:boolean;
  children:JSX.Element[] | JSX.Element;
}

export default function ChatLoader(props:IChatLoader){
  return(
    <>
      {props.isLoading ? (
        <div className="h-100 align-center"></div>
      ) :(
        props.children
      )}
    </>
  )
}