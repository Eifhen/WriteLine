import React, { createContext, useContext, useState } from "react";
import { getCurrentUser } from '../hooks/useGetCurrentUser';
import IUserDTO, { emptyUserDTO } from '../models/UserModel';
import { useCreateSocketServer } from "../hooks/useCreateSocketServer";
import { createRoom } from "../utils/socketOperations";
import { WriteLineSocket } from "../utils/channels.socket";
import objectIsNotEmpty from "../utils/object_helpers";


export interface IWriteLineContext {
  userData: IUserDTO;
  setUserData: React.Dispatch<React.SetStateAction<IUserDTO>>;
  socketServer: WriteLineSocket;
}

export const WriteLineContext = createContext({} as IWriteLineContext);

export const WriteLineContextProvider = ({children}:any) => {
  const [userData, setUserData] = useState(emptyUserDTO());
  const [socketServer, setSocketServer] = useState<any>(null);
  
  useCreateSocketServer((socket)=>{
    getCurrentUser((data)=>{
      if(objectIsNotEmpty(data)){
        setSocketServer(socket);
        setUserData(data);
        createRoom(socket, data);
      }
    })
  });
  
  const data: IWriteLineContext = {
    userData,
    setUserData,
    socketServer
  }

  return (
    <WriteLineContext.Provider value={data}>
      {children}
    </WriteLineContext.Provider>
  )
}


export function useWriteLineContext(){
  const context = useContext(WriteLineContext);
  return context;
}