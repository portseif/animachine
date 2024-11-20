import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Modern polyfills are included in core-js
import 'core-js/features/array/find';
import 'core-js/features/array/find-index';
import 'core-js/features/array/from';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
