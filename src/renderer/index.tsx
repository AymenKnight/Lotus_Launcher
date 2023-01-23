import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.scss';

const app = document.getElementById('app-mount');
const root = createRoot(app as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
