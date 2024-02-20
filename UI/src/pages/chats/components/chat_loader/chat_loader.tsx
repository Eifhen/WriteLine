import { Spinner } from "@chakra-ui/react";
import { memo } from "react";



interface IChatLoader {
  isLoading:boolean;
  children:JSX.Element[] | JSX.Element;
}

const ChatLoader = memo((props:IChatLoader) => {
  return(
    <>
      {props.isLoading ? (
        <div className="h-100 align-center">
          <Spinner 
            thickness='4px'
            color="blue.300"
            size='xl'
          />
        </div>
      ) :(
        props.children
      )}
    </>
  )
});

export default ChatLoader;