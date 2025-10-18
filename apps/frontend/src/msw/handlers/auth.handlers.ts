// External libraries
import { http, HttpResponse } from 'msw';

// Interfaces
import { EmailDto, LoginDto } from '../../../backend-api/api';

// Mocks
import { mockUser } from '../../utils/test-utils';

/**
 * Default auth handlers - Happy path responses
 */
export const authHandlers = [
  // GET /auth/refresh - Returns authenticated user
  http.get('http://localhost:3000/auth/refresh', () => {
    return HttpResponse.json(mockUser);
  }),

  // POST /auth/login - Returns authenticated user
  http.post<never, LoginDto>('http://localhost:3000/auth/login', () => {
    return HttpResponse.json(mockUser);
  }),

  // POST /auth/reset - Sends password reset email
  http.post<never, EmailDto>('http://localhost:3000/auth/reset', () => {
    return HttpResponse.json({}, { status: 200 });
  }),
];

/**
 * Auth error handlers for testing failure scenarios
 */
export const authErrorHandlers = {
  // Login with invalid credentials
  loginError: http.post<never, LoginDto>('http://localhost:3000/auth/login', () => {
    return HttpResponse.json({ message: 'Login error' }, { status: 400 });
  }),

  // Password reset email failure
  resetPasswordError: http.post<never, EmailDto>('http://localhost:3000/auth/reset', () => {
    return HttpResponse.json({ message: 'Failed to send email' }, { status: 400 });
  }),

  // Unauthorized refresh token
  refreshUnauthorized: http.get('http://localhost:3000/auth/refresh', () => {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }),
};
