// External libraries
import { setupServer } from 'msw/node';

// Custom handlers
import { handlers } from './handlers/index';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
