// External libraries
import { http, HttpResponse } from 'msw';

// Interfaces
import { EmailDto, LoginDto, ResetPwdDto, RegisterDto } from '../../backend-api/api';

// Mocks
import { mockUser } from '../utils/test-utils';

export const handlers = [
  // Handles the GET /auth/refresh request
  http.get('http://localhost:3000/auth/refresh', () => {
    // Happy path
    return HttpResponse.json(mockUser);
  }),
  // Handles the POST /auth/login request
  http.post<never, LoginDto>('http://localhost:3000/auth/login', async ({ request }) => {
    const { username, password } = await request.json();
    // Sad path
    if (username === 'wronguser' && password === 'wrongpwd') {
      return HttpResponse.json(
        {
          message: 'Login error',
        },
        { status: 400 },
      );
    }
    // Happy path
    return HttpResponse.json(mockUser);
  }),
  // Handles the POST /users/reset-pwd request
  http.post<never, ResetPwdDto>('http://localhost:3000/users/reset-pwd', async ({ request }) => {
    const { password } = await request.json();
    // Sad path
    if (password === 'ServerError#7') {
      return HttpResponse.json(
        {
          message: 'Server error',
        },
        { status: 400 },
      );
    }
    // Happy path
    return HttpResponse.json();
  }),
  // Handles the POST /email/reset request
  http.post<never, EmailDto>('http://localhost:3000/auth/reset', async ({ request }) => {
    const { email } = await request.json();
    // Sad path
    if (email === 'fail@test.com') {
      return HttpResponse.json(
        {
          message: 'Server error',
        },
        { status: 400 },
      );
    }
    // Happy path
    return HttpResponse.json();
  }),
  // Handles the POST /users/create request
  http.post<never, RegisterDto>('http://localhost:3000/users/create', async ({ request }) => {
    const { username } = await request.json();
    // Sad path
    if (username === 'repeated') {
      return HttpResponse.json(
        {
          message: 'Sign up error',
        },
        { status: 400 },
      );
    }
    // Happy path
    return HttpResponse.json();
  }),
];
