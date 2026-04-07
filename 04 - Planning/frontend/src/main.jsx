// src/main.jsx
// Vite entry point — this is where React mounts to the DOM.
// Vite (the build tool) reads this file first when you run `npm run dev`
// or `npm run build`. You never need to edit this file.
import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
