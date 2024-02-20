import { useState } from "react";
import { IChatModel } from "../models/ChatModel";
import { WriteLineSocket } from "../utils/channels.socket";
import useIsTyping from "./useIsTyping";
import IUserDTO from "../models/UserModel";


interface ITypingIndicator {
  typingUser: IUserDTO;
  isTyping:boolean;
}

export default function useTypingIndicator(socketServer:WriteLineSocket, activeChat:IChatModel) : ITypingIndicator {
  const [state, setState] = useState<ITypingIndicator>({
    isTyping: false,
    typingUser: {} as IUserDTO
  });

  useIsTyping(socketServer, (data)=>{
    const isSameChat = activeChat._id === data.chatId;
    if(isSameChat && activeChat.users){
      const user = activeChat.users.find(m => m.guid == data.guid);
      if(user){
        setState({
          isTyping: data.isTyping,
          typingUser: user,
        });
      }
    }
  },[socketServer, activeChat]);

  return state;
}