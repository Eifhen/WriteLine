
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import SignupPage from '../pages/signup/signup.page';
import LoginPage from '../pages/login/login.page';
import HomePage from '../pages/home/home.page';
import ChatsPage from '../pages/chats/chats.page';
import Error404Page from '../pages/error404/error404.page';
import AutenticationRoute from './autentication.route';
import { useMemo } from 'react';
import { WriteLineContextProvider } from '../context/writeline.context';
import WriteLineApp from '../components/WriteLineApp/writelineApp.component';

export default function RouterManager(){

  const WriteLineProvider = useMemo(()=>(
    <WriteLineContextProvider>
      <WriteLineApp>
        <Outlet/>
      </WriteLineApp>
    </WriteLineContextProvider>
  ),[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage/> } />
        <Route path="/home" element={ <HomePage/> } />
        <Route path="/login" element={ <LoginPage/> } />
        <Route path="/signup" element={ <SignupPage/> } />

        <Route element={<AutenticationRoute/>}>
          <Route element={ WriteLineProvider }>
            <Route path="/chats" element={ <ChatsPage/> } />
          </Route>
        </Route>
        
        <Route path="*" element={ <Error404Page/> } />
      </Routes>
    </BrowserRouter>
  )
}
