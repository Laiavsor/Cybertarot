import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Сервис-воркер только в проде — иначе он мешает dev-HMR
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* офлайн-режим не критичен */ });
  });
}
