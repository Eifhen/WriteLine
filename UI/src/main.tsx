import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import RouterManager from './router/router.manager';
import './assets/css/general.css';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <ChakraProvider>
        <RouterManager/>
     </ChakraProvider>
  </StrictMode>
)
