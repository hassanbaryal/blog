import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/stylesheets/main.css';
import RouteSwitch from './components/Routes/RouteSwitch';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);
