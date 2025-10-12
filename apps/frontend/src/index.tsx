// React
import { createRoot } from 'react-dom/client';

// External libraries
import { Provider } from 'react-redux';

// Store
import { setupStore } from './store/store';

// Components
import App from './App';

// Create root element
const root = createRoot(document.getElementById('root') as HTMLElement);

// Render react tree
root.render(
  <Provider store={setupStore()}>
    <App />
  </Provider>,
);
