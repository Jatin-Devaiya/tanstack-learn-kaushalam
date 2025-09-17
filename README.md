# TanStack React Query Advanced Demo

A comprehensive Next.js application demonstrating advanced React Query features with clean, maintainable code practices.

##  Features Implemented

### 1. Error Boundaries with React Query
- **Custom Error Boundary Component**: Graceful error handling for API failures
- **API Error Classification**: Distinguishes between network errors and API errors
- **Retry Mechanisms**: Automatic retry with exponential backoff
- **User-Friendly Error Messages**: Clear error display with retry options

### 2. Batch Queries with useQueries
- **Parallel Data Fetching**: Efficiently fetch multiple users simultaneously
- **Dynamic Query Management**: Add/remove queries dynamically
- **Loading State Management**: Individual loading states for each query
- **Error Handling**: Per-query error handling and retry functionality

### 3. React Suspense Integration
- **Lazy Loading**: Components loaded on-demand for better performance
- **Suspense Boundaries**: Multiple suspense boundaries for granular loading control
- **Loading Fallbacks**: Custom loading components for better UX
- **Error Boundaries**: Nested error boundaries for component-level error handling

### 4. Pagination Implementation
- **Infinite Scroll**: Seamless infinite scrolling with intersection observer
- **Traditional Pagination**: Page-based navigation with controls
- **Background Refetching**: Automatic data refresh with configurable intervals
- **Cache Management**: Smart cache invalidation and management

### 5. Background Fetching & Optimistic Updates
- **Optimistic Updates**: Instant UI updates with automatic rollback on failure
- **Background Refetching**: Configurable automatic data refresh
- **Cache Synchronization**: Smart cache updates and invalidation
- **User Experience**: Immediate feedback with fallback handling

### 6. Clean Code Practices
- **Custom Hooks**: Modular, reusable hooks for data fetching
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Error Handling**: Centralized error handling and logging
- **Code Organization**: Well-structured components and utilities

##  Technical Stack

- **Next.js 15**: React framework with App Router
- **TanStack React Query v5**: Data fetching and state management
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Suspense**: Lazy loading and loading states
- **Error Boundaries**: Graceful error handling

##  Project Structure

```
src/
 api/
    users.ts              # Enhanced API functions with error handling
 components/
    ErrorBoundary.tsx     # Custom error boundary component
    BatchQueriesDemo.tsx  # useQueries demonstration
    SuspenseDemo.tsx      # React Suspense implementation
    OptimisticUpdateDemo.tsx # Optimistic updates demo
    LazyUserProfile.tsx   # Lazy-loaded user profile
    LazyPostsList.tsx     # Lazy-loaded posts list
    AddUserForm.tsx       # User creation form
    UsersList.tsx         # Users list with pagination
    QueryWrapper.tsx      # Query client provider
 hooks/
    useUsers.ts           # Custom hooks for data fetching
 lib/
    react-query.ts        # Query client configuration
 app/
     AppContent.tsx        # Main application content
     layout.tsx            # Root layout
     page.tsx              # Home page
```

##  Key Features Explained

### Error Boundaries
```typescript
// Custom error boundary with API error handling
class ErrorBoundary extends Component {
  // Handles both React errors and API errors
  // Provides retry functionality
  // Shows user-friendly error messages
}
```

### Batch Queries
```typescript
// Efficient parallel data fetching
const userQueries = useBatchUserData(selectedUserIds);
// Each query has individual loading/error states
// Dynamic query management
```

### React Suspense
```typescript
// Lazy loading with suspense
const LazyUserProfile = lazy(() => import("./LazyUserProfile"));

<Suspense fallback={<LoadingFallback />}>
  <LazyUserProfile userId={1} />
</Suspense>
```

### Optimistic Updates
```typescript
// Instant UI updates with rollback
const optimisticUpdate = useOptimisticUserUpdate();
// Updates UI immediately
// Rolls back on failure
// Confirms on success
```

##  Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

##  Learning Objectives

This project demonstrates:

1. **Error Handling**: How to gracefully handle API errors with React Query
2. **Performance**: Efficient data fetching with batch queries and caching
3. **User Experience**: Optimistic updates and loading states
4. **Code Organization**: Clean, maintainable code structure
5. **Modern React**: Suspense, Error Boundaries, and custom hooks
6. **TypeScript**: Type-safe development practices

##  Configuration

### Query Client Configuration
- **Stale Time**: 5 minutes (data stays fresh)
- **Cache Time**: 10 minutes (data stays in cache)
- **Retry Logic**: Smart retry with exponential backoff
- **Background Refetching**: Configurable intervals
- **Error Handling**: Global error handlers

### API Configuration
- **Base URL**: DummyJSON API
- **Error Handling**: Custom error classes
- **Type Safety**: Full TypeScript interfaces
- **Retry Logic**: Built-in retry mechanisms

##  UI Features

- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Error States**: User-friendly error messages
- **Success States**: Confirmation messages
- **Interactive Elements**: Hover effects and transitions

##  Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Caching**: Smart cache management
- **Background Updates**: Non-blocking data refresh
- **Optimistic Updates**: Instant UI feedback
- **Batch Operations**: Parallel data fetching

##  Testing Features

- **Error Scenarios**: Test error boundaries
- **Loading States**: Test loading components
- **User Interactions**: Test form submissions
- **Data Fetching**: Test query invalidation
- **Cache Management**: Test cache updates

##  Documentation

Each component includes:
- **JSDoc Comments**: Function and component documentation
- **Type Definitions**: Full TypeScript interfaces
- **Error Handling**: Comprehensive error scenarios
- **Usage Examples**: Clear implementation examples

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is for educational purposes and demonstrates advanced React Query patterns.

---

**Built with  using Next.js, TanStack Query, and modern React patterns**
