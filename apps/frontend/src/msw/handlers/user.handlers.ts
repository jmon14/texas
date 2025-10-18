// External libraries
import { http, HttpResponse } from 'msw';

// Interfaces
import { RegisterDto, ResetPwdDto } from '../../../backend-api/api';

/**
 * Default user handlers - Happy path responses
 */
export const userHandlers = [
  // POST /users/create - Create new user account
  http.post<never, RegisterDto>('http://localhost:3000/users/create', () => {
    return HttpResponse.json({}, { status: 201 });
  }),

  // POST /users/reset-pwd - Reset password with token
  http.post<never, ResetPwdDto>('http://localhost:3000/users/reset-pwd', () => {
    return HttpResponse.json({}, { status: 200 });
  }),
];

/**
 * User error handlers for testing failure scenarios
 */
export const userErrorHandlers = {
  // Registration with duplicate username
  signupDuplicateUsername: http.post<never, RegisterDto>(
    'http://localhost:3000/users/create',
    () => {
      return HttpResponse.json({ message: 'Sign up error' }, { status: 400 });
    },
  ),

  // Password reset with invalid token
  resetPasswordInvalidToken: http.post<never, ResetPwdDto>(
    'http://localhost:3000/users/reset-pwd',
    () => {
      return HttpResponse.json({ message: 'Server error' }, { status: 400 });
    },
  ),
};
