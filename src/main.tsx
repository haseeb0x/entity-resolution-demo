import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { runSmokeTest } from '@/lib/matching/smoke-test';

if (import.meta.env.DEV) runSmokeTest();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
