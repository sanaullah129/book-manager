# 📚 Book Manager Application

A modern full-stack book management application with JWT authentication, comprehensive error handling, and a beautiful user interface.

## 🚀 Features

- **User Authentication**: Secure JWT-based login system
- **Book Management**: Complete CRUD operations for books
- **Modern UI**: Beautiful Material-UI components with custom styling
- **Real-time Feedback**: Toast notifications and loading states
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Statistics Dashboard**: Visual insights into your book collection
- **Comprehensive Error Handling**: Robust backend with detailed logging
- **Input Validation**: Client and server-side validation

## 🧱 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library for beautiful UI
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Token for authentication
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
book-manager/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components (Login, Dashboard)
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS styling files
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── data/           # In-memory data storage
│   │   ├── utils/          # Utility functions & error handling
│   │   └── authMiddleware.js # JWT authentication middleware
│   └── index.js            # Server entry point
│
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/sanaullah129/book-manager.git
cd book-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend development server will start on `http://localhost:5173`

## 🔐 Authentication

### Default User Credentials
```javascript
Username: admin
Password: admin123

Username: user1  
Password: user123
```

### API Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🌐 API Endpoints

### Authentication
- `POST /login` - User login and token generation

### Books Management
- `GET /books` - Get all books (protected)
- `POST /books` - Create a new book (protected)
- `GET /books/:id` - Get a specific book (protected)
- `PUT /books/:id` - Update a book (protected)
- `DELETE /books/:id` - Delete a book (protected)

### System
- `GET /health` - Health check endpoint

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-07-30T..."
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": { ... },
    "timestamp": "2025-07-30T..."
  }
}
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 3. Get Books
```bash
curl -X GET http://localhost:5000/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Book
```bash
curl -X POST http://localhost:5000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald", 
    "genre": "Fiction",
    "yearPublished": 1925
  }'
```

## 🎨 Frontend Features

### Dashboard
- **Statistics Cards**: Visual overview of your book collection
- **Responsive Table**: Sortable and interactive book listing
- **CRUD Operations**: Add, edit, and delete books with modals
- **Real-time Updates**: Automatic refresh after operations

### Authentication
- **Secure Login**: JWT-based authentication
- **Route Protection**: Automatic redirection for unauthorized access
- **Session Management**: Token expiration handling

### UI/UX
- **Modern Design**: Glassmorphism effects and gradients
- **Loading States**: Elegant spinners during operations
- **Toast Notifications**: Success and error feedback
- **Mobile Responsive**: Optimized for all screen sizes

## 🔧 Backend Features

### Error Handling
- **Comprehensive Try-Catch**: All routes protected with error handling
- **Structured Logging**: JSON-formatted logs with context
- **Custom Error Classes**: ValidationError, AuthenticationError, etc.
- **Global Error Handler**: Centralized error processing

### Security
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Cross-origin request handling
- **Error Message Security**: No sensitive data leakage

### Logging
- **Request Logging**: All incoming requests logged with context
- **User Action Tracking**: Login attempts, CRUD operations
- **Error Tracking**: Stack traces and error context
- **Performance Monitoring**: Response times and system health

## 🚀 Development

### Running in Development Mode

**Backend (with auto-restart):**
```bash
cd backend
npm install -g nodemon
nodemon index.js
```

**Frontend (with hot reload):**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## 🔄 Data Flow

1. **Authentication**: User logs in → JWT token generated → Token stored in localStorage
2. **Route Protection**: App.jsx checks authentication → Redirects based on auth status
3. **API Requests**: Frontend sends requests with Bearer token → Backend validates → Response
4. **Error Handling**: Errors caught → Logged → User-friendly message displayed

## 🐛 Error Scenarios

The application handles various error scenarios:
- Invalid login credentials
- Missing or expired JWT tokens
- Network connectivity issues
- Validation errors (empty fields, invalid data types)
- Duplicate book entries
- Non-existent resource access

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sanaullah**
- GitHub: [@sanaullah129](https://github.com/sanaullah129)

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- Express.js community for the robust backend framework
