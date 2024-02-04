





export enum CHANNEL {
  CreateRoom = 'create-room',
  JoinChat = 'join-chat',
  
  NewMessage = 'new-message',
  MessageRecieved = 'message-recieved',
  
  Connection = 'connection',
  Connected = 'connected',  
  ConnectionError = 'connect_error',  

  Desconecting = 'disconnecting',
  Disconnect = 'disconnect',
  Error = 'error',
}