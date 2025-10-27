# My Note Pad - Backend API

A RESTful API backend for a note-taking application built with Node.js, Express, TypeScript, and MongoDB.

## Project Status

**Work in Progress**

### What's Working
- User authentication (signup/login) with JWT
- Basic CRUD operations for notes
- User authorization (owner/admin restrictions)
- Input validation with Zod schemas
- MongoDB integration with Mongoose
- Cookie-based authentication
- CORS configuration for frontend integration

### What Still Needs to Be Done
- **Comprehensive error handling** - Current global error handler needs improvement
- **Additional user routes** - User profile management, password reset, etc.
- **Additional functionalities** - Note sharing, categories/tags, search, etc.
- Better validation and edge case handling
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- Rate limiting and security enhancements

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: tsx, nodemon

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or cloud)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-note-pad-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your configuration:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<DATABASE_PASSWORD>@cluster.mongodb.net/notepad?retryWrites=true&w=majority
DATABASE_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start server with tsx
- `npm run start:prod` - Start production server (requires build)

## API Endpoints

### Authentication Routes (`/api/v1/users`)

#### Public Routes
- `POST /signup` - Create a new user account
  - Body: `{ name, email, password, passwordConfirm }`
- `POST /login` - Login to existing account
  - Body: `{ email, password }`

#### Protected Routes (Requires Authentication)
- `GET /me` - Get current user information
- `GET /me/notes` - Get all notes for current user
- `POST /me/notes` - Create a new note for current user

### Note Routes (`/api/v1/notes`)

All note routes require authentication.

- `GET /` - Get all notes (filtered by user)
- `GET /:id` - Get a specific note (owner/admin only)
- `PATCH /:id` - Update a note (owner/admin only)
- `DELETE /:id` - Delete a note (owner/admin only)

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Route controllers
│   ├── authController.ts
│   ├── noteController.ts
│   └── userController.ts
├── middleware/      # Custom middleware
│   ├── auth/       # Authentication & authorization
│   └── validation/ # Input validation
├── models/          # Mongoose models
│   ├── noteModel.ts
│   └── userModel.ts
├── routes/          # API routes
│   ├── noteRoutes.ts
│   └── userRoutes.ts
├── schemas/         # Zod validation schemas
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   ├── appError.ts
│   ├── catchAsync.ts
│   └── JWTHelper.ts
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Authentication Flow

1. User signs up or logs in
2. Server generates JWT token
3. Token is sent via HTTP-only cookie
4. Client includes cookie in subsequent requests
5. Server validates token via `protect` middleware

## Known Issues & Limitations

- Error handling is basic and needs to be more robust
- No password reset functionality yet
- No email verification
- Missing comprehensive input validation in some routes
- No rate limiting implemented
- No pagination for notes listing
- Limited user management features

## Contributing

This is a personal work-in-progress project. Contributions and suggestions are welcome!

## License

ISC

## Author

Morgrace Precious

---

**Note**: This project is under active development. Features and APIs may change.
