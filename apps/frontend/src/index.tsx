// React
import { createRoot } from 'react-dom/client';

// External libraries
import { Provider } from 'react-redux';

// Store
import { setupStore } from './store/store';

// Components
import App from './App';

// MSW initialization (E2E tests only)
import { initMSW } from './msw/init';

// Create root element
const root = createRoot(document.getElementById('root') as HTMLElement);

// Initialize MSW for E2E tests (if enabled), then render the app
initMSW().then(() => {
  root.render(
    <Provider store={setupStore()}>
      <App />
    </Provider>,
  );
});
