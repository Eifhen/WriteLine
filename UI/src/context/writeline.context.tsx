import React, { createContext, useContext, useState } from "react";
import useGetCurrentUser from '../hooks/useGetCurrentUser';
import IUserDTO from '../models/UserModel';

interface IWriteLineContext {
  userData: IUserDTO;
  setUserData: React.Dispatch<React.SetStateAction<IUserDTO>>
}

export const WriteLineContext = createContext({} as IWriteLineContext);

export const WriteLineContextProvider = ({children}:any) => {
  const [userData, setUserData] = useState({} as IUserDTO);

  useGetCurrentUser((res)=> {
    setUserData(res);
  },[]);

  
  const data: IWriteLineContext = {
    userData,
    setUserData
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