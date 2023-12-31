import { Skeleton, Stack } from "@chakra-ui/react";









interface IContactLoader {
  isLoading:boolean;
  children:JSX.Element[] | JSX.Element;
}

export default function ContactLoader(props:IContactLoader){
  return(
    <>
      {props.isLoading ? (
        <Stack>
          <Skeleton height='70px' className="rounded-15" startColor="gray.50" endColor="gray.200" />
          <Skeleton height='70px' className="rounded-15" startColor="gray.50" endColor="gray.200" />
          <Skeleton height='70px' className="rounded-15" startColor="gray.50" endColor="gray.200" />
          <Skeleton height='70px' className="rounded-15" startColor="gray.50" endColor="gray.200" />
          <Skeleton height='70px' className="rounded-15" startColor="gray.50" endColor="gray.200" />
        </Stack>
      ) :(
        props.children
      )}
    </>
  )
}