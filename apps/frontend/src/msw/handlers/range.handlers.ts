// External libraries
import { http, HttpResponse } from 'msw';

// Interfaces
import { CreateRangeDto, RangeResponseDto, UpdateRangeDto } from '../../../backend-api/api';

// Mock data
const mockRange: RangeResponseDto = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Range',
  userId: 'user-123',
  handsRange: [
    {
      rangeFraction: 0.5,
      label: 'RAISE',
      actions: [{ type: 'RAISE' as any, percentage: 50 }],
    },
  ],
};

const mockRanges: RangeResponseDto[] = [
  mockRange,
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Test Range 2',
    userId: 'user-123',
    handsRange: [
      {
        rangeFraction: 0.3,
        label: 'CALL',
        actions: [{ type: 'CALL' as any, percentage: 30 }],
      },
    ],
  },
];

/**
 * Default range handlers - Happy path responses
 */
export const rangeHandlers = [
  // GET /ranges - Get all ranges
  http.get('http://localhost:3000/ranges', () => {
    return HttpResponse.json(mockRanges);
  }),

  // GET /ranges/user/:userId - Get ranges by user ID
  http.get('http://localhost:3000/ranges/user/:userId', ({ params }) => {
    const { userId } = params;
    // Simulate error for specific user ID
    if (userId === 'error-user') {
      return HttpResponse.json({ message: 'Failed to fetch ranges' }, { status: 500 });
    }
    return HttpResponse.json(mockRanges);
  }),

  // GET /ranges/:id - Get range by ID
  http.get('http://localhost:3000/ranges/:id', ({ params }) => {
    const { id } = params;
    const range = mockRanges.find((r) => r._id === id);
    if (range) {
      return HttpResponse.json(range);
    }
    return HttpResponse.json({ message: 'Range not found' }, { status: 404 });
  }),

  // POST /ranges - Create new range
  http.post<never, CreateRangeDto>('http://localhost:3000/ranges', async ({ request }) => {
    const body = await request.json();
    const newRange: RangeResponseDto = {
      _id: '507f1f77bcf86cd799439099',
      name: body.name,
      userId: 'user-123',
      handsRange: body.handsRange,
    };
    return HttpResponse.json(newRange, { status: 201 });
  }),

  // PATCH /ranges/:id - Update range
  http.patch<{ id: string }, UpdateRangeDto>(
    'http://localhost:3000/ranges/:id',
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      const range = mockRanges.find((r) => r._id === id);
      if (range) {
        const updatedRange: RangeResponseDto = {
          ...range,
          ...body,
        };
        return HttpResponse.json(updatedRange);
      }
      return HttpResponse.json({ message: 'Range not found' }, { status: 404 });
    },
  ),

  // DELETE /ranges/:id - Delete range
  http.delete('http://localhost:3000/ranges/:id', ({ params }) => {
    const { id } = params;
    const range = mockRanges.find((r) => r._id === id);
    if (range) {
      return HttpResponse.json({ message: 'Range deleted successfully' });
    }
    return HttpResponse.json({ message: 'Range not found' }, { status: 404 });
  }),
];

/**
 * Range error handlers for testing failure scenarios
 */
export const rangeErrorHandlers = {
  // Get ranges - Server error
  getRangesError: http.get('http://localhost:3000/ranges/user/:userId', () => {
    return HttpResponse.json({ message: 'Failed to fetch ranges' }, { status: 500 });
  }),

  // Get range by ID - Not found
  getRangeNotFound: http.get('http://localhost:3000/ranges/:id', () => {
    return HttpResponse.json({ message: 'Range not found' }, { status: 404 });
  }),

  // Create range - Validation error
  createRangeValidationError: http.post('http://localhost:3000/ranges', () => {
    return HttpResponse.json({ message: 'Validation failed: name is required' }, { status: 400 });
  }),

  // Create range - Limit exceeded (10 ranges max)
  createRangeLimitExceeded: http.post('http://localhost:3000/ranges', () => {
    return HttpResponse.json(
      { message: 'Range limit exceeded. Maximum 10 ranges allowed.' },
      { status: 400 },
    );
  }),

  // Update range - Not found
  updateRangeNotFound: http.patch('http://localhost:3000/ranges/:id', () => {
    return new HttpResponse(JSON.stringify({ message: 'Range not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Delete range - Not found
  deleteRangeNotFound: http.delete('http://localhost:3000/ranges/:id', () => {
    return HttpResponse.json({ message: 'Range not found' }, { status: 404 });
  }),

  // Delete range - Server error
  deleteRangeError: http.delete('http://localhost:3000/ranges/:id', () => {
    return HttpResponse.json({ message: 'Failed to delete range' }, { status: 500 });
  }),
};

// Export mock data for use in tests
export { mockRange, mockRanges };
