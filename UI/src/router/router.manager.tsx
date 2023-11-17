
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignupPage from '../pages/signup/signup.page';
import LoginPage from '../pages/login/login.page';
import HomePage from '../pages/home/home.page';
import ChatsPage from '../pages/chats/chats.page';
import ConfigPage from '../pages/config/config.page';
import Error404Page from '../pages/error404/error404.page';

export default function RouterManager(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage/> } />
        <Route path="/home" element={ <HomePage/> } />
        <Route path="/login" element={ <LoginPage/> } />
        <Route path="/signup" element={ <SignupPage/> } />
        <Route path="/chats" element={ <ChatsPage/> } />
        <Route path="/config" element={ <ConfigPage/> } />
        <Route path="*" element={ <Error404Page/> } />
      </Routes>
    </BrowserRouter>
  )
}
