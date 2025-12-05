# Frontend

A React-based frontend application for the Texas Poker platform, providing an intuitive interface for poker range analysis, file management, and user authentication.

## 🏗️ Architecture Overview

The Frontend is a **modern React application** that serves as the main user interface for:

- **Poker Range Analysis** - Interactive range builder and visualizer
- **Scenario Browser** - Browse and view poker training scenarios
- **File Management** - Upload and manage poker-related files
- **User Authentication** - Login, registration, and account management
- **Theme Management** - Dark/light mode support

## 📁 Project Structure

```
apps/frontend/
├── src/
│   ├── components/          # React Components (Atomic Design)
│   │   ├── atoms/           # Basic UI components (buttons, inputs)
│   │   ├── molecules/       # Composite components (forms, tables)
│   │   ├── organisms/       # Complex features (range builder, uploader)
│   │   ├── pages/           # Page-level components
│   │   └── templates/       # Layout templates
│   ├── store/               # Redux Toolkit State Management
│   │   ├── slices/          # Feature-based state slices
│   │   └── store.ts         # Redux store configuration
│   ├── hooks/               # Custom React hooks
│   ├── routes/              # React Router configuration
│   ├── api/                 # API integration layer
│   ├── theme/               # Material-UI theme configuration
│   ├── utils/               # Utility functions
│   └── constants/           # Application constants
├── backend-api/             # Auto-generated Backend API client
└── public/                  # Static assets
```

## 🚀 Quick Start

### Development

**For complete setup instructions, see [CONTRIBUTING.md](../CONTRIBUTING.md)**

#### Environment Configuration

Before running the Frontend locally, set up environment variables:

```bash
# Create environment file
cat > .env << EOF
# API URLs
REACT_APP_BACKEND_API_URL=http://localhost:3000
```

#### Key Frontend Commands

```bash
# API client generation (run when backend APIs change)
npm run openapi:backend   # Generate Backend API client

# Component development
npm run storybook         # Interactive component library

# Testing & Quality
npm test                  # Unit tests
npm run test:coverage     # Coverage report
npm run lint             # ESLint checking
npm run type-check       # TypeScript validation
```

## 🎯 Core Features

### 🃏 Poker Range Builder

The heart of the application - an interactive poker range analysis tool:

- **Visual Range Grid**: 13x13 matrix representing all poker hands
- **Action Assignment**: Define actions (fold, call, raise) for each hand
- **Range Management**: Create, save, and load custom ranges
- **Real-time Updates**: Instant visual feedback on range changes

### 📚 Scenario Browser

Browse and explore poker training scenarios:

- **Scenario List View**: Card-based display of all available scenarios
- **Client-side Filtering**: Filter by Game Type, Difficulty, and Category
- **Scenario Detail View**: Full scenario information including context and instructions
- **Difficulty Indicators**: Color-coded badges (Beginner/Intermediate/Advanced)
- **Category Organization**: Scenarios organized by category (Opening Ranges, 3-Betting, etc.)

### 📁 File Management

Upload and manage poker-related files:

- **Drag & Drop**: Intuitive file upload interface
- **CSV Support**: Primary format for poker data files
- **Progress Tracking**: Real-time upload progress
- **File Organization**: User-specific file storage

### 👤 User Authentication

Complete authentication system:

- **Login/Register**: User account creation and login
- **Email Verification**: Secure email confirmation
- **Password Reset**: Token-based password recovery
- **Session Management**: Automatic token refresh

### 🎨 Theme System

Modern UI with theme support:

- **Dark/Light Mode**: Toggle between themes
- **Material-UI**: Consistent design system

## 🔄 State Management

### Redux Toolkit Integration

Centralized state management using Redux Toolkit:

#### **User Slice**

```typescript
// User authentication and profile management
{
  user: UserEntity | undefined;
  status: FetchStatus;
  error: unknown;
}
```

#### **Range Slice**

```typescript
// Poker range data and operations
{
  ranges: Range[];
  currentRange: Range | null;
  status: FetchStatus;
  error: unknown;
}
```

#### **Scenario Slice**

```typescript
// Scenario data and operations
{
  scenarios: ScenarioResponseDto[];
  currentScenario: ScenarioResponseDto | null;
  status: FetchStatus;
  error: unknown;
}
```

#### **Theme Slice**

```typescript
// UI theme preferences
{
  mode: 'light' | 'dark';
}
```

### Async Operations

- **createAsyncThunk**: Handle API calls with loading states
- **Error Handling**: Centralized error management
- **Optimistic Updates**: Immediate UI feedback

## 🌐 API Integration

### Backend API Connection

Connects to the unified Backend service:

#### **Backend API** (Authentication, Files & Ranges)

```typescript
// User management, file operations, and range analysis
authApi.login(credentials);
userApi.createUser(userData);
filesApi.uploadFile(file);

// Poker range operations
rangesApi.createRange(range);
rangesApi.getRangesByUserId(userId);
rangesApi.updateRange(id, range);

// Scenario operations
scenariosApi.getScenarios(gameType, difficulty, category);
scenariosApi.getScenarioById(id);
scenariosApi.getScenariosByCategory(category);

// Reference ranges (GTO solutions) - Available but not yet integrated in UI
referenceRangesApi.getReferenceRangeByScenarioId(scenarioId);
referenceRangesApi.importReferenceRangeForScenario(scenarioId);
referenceRangesApi.importAllReferenceRanges();
```

### Automatic Token Refresh

- **JWT Management**: Automatic token refresh on 401 errors
- **Cookie-based**: Secure HTTP-only cookies
- **Interceptor Pattern**: Transparent token handling

## 🎨 UI/UX Design

### Material-UI Framework

- **Component Library**: Pre-built, accessible components
- **Theme System**: Consistent design tokens
- **Typography**: Consistent text hierarchy

### Interactive Features

- **Drag & Drop**: File upload and range selection
- **Real-time Updates**: Instant visual feedback
- **Loading States**: Clear operation status
- **Error Handling**: User-friendly error messages

## 🧪 Testing Strategy

### Testing Stack

```bash
# Unit tests
npm test

# Coverage report
npm run test:coverage

# Storybook (component development)
npm run storybook
```

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking for tests
- **Storybook**: Component development and documentation

## 📚 Development Tools

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run build
```

### API Code Generation

```bash
# Generate Backend API client
npm run openapi:backend
```

### Storybook Development

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 🔧 Build System

### Webpack Configuration

- **Development Server**: Hot reload for development
- **Production Build**: Optimized bundle generation
- **Asset Management**: Static file handling
- **Environment Variables**: Configuration management

### Environment Setup

```bash
# Development
REACT_APP_BACKEND_API_URL=http://localhost:3000

# Production
REACT_APP_BACKEND_API_URL=https://api.allinrange.com
```

## 🚀 Deployment

### Build Process

```bash
# Create production build
npm run build

# Serve static files
npm run serve
```

### Docker Support

```dockerfile
# Multi-stage build for optimization
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 📊 Performance Features

### Optimization Strategies

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser caching strategies
- **Image Optimization**: Compressed assets

### Monitoring

- **Error Tracking**: Centralized error logging
- **Performance Metrics**: Core Web Vitals
- **User Analytics**: Usage tracking

## 🤝 Contributing

### Development Guidelines

1. **Follow Atomic Design**: Use appropriate component level
2. **Write Tests**: Unit tests for new components
3. **Use TypeScript**: Strict type checking
4. **Follow ESLint**: Code quality standards
5. **Document Components**: Add Storybook stories

### Code Style

- **Prettier**: Automatic code formatting
- **ESLint**: Code quality rules
- **TypeScript**: Strict type checking
- **Conventional Commits**: Git commit messages

## 📄 License

This project is part of the Texas Poker application and is licensed under the MIT License.
