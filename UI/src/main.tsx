import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import RouterManager from './router/router.manager';
import './assets/css/general.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterManager/>
  </StrictMode>
)
