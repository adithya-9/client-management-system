# Clients UI

A React-based admin management dashboard for creating and managing admin accounts with secure password hashing.

## Features

✅ **Secure Password Handling** - BCrypt password hashing  
✅ **Form Validation** - Client-side validation with helpful error messages  
✅ **Responsive Design** - Beautiful UI with Tailwind CSS  
✅ **Real-time Feedback** - Success/error messages after submission  
✅ **Easy Integration** - Connected to the Clients API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Clints_UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
Clints_UI/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── AdminForm.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Environment Setup

The API is configured to connect to `http://localhost:8080/eswaradithya/admins/save`

Make sure your Spring Boot backend is running on port 8080.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Technology Stack

- **React** 18.2.0 - UI Framework
- **Tailwind CSS** 3.3.0 - Utility-first CSS
- **Axios** 1.4.0 - HTTP Client
- **PostCSS** - CSS Processing

## Features Explained

### 1. Admin Form
- Email validation
- Secure password input
- Role selection (Admin, Super Admin, Manager, User)
- Real-time form feedback

### 2. Password Security
- Password is hashed using BCrypt on the backend
- Only hashed passwords are stored in the database
- Never stored or transmitted in plain text

### 3. Error Handling
- Validation for all required fields
- Email format validation
- User-friendly error messages
- Network error handling

## API Integration

The form sends POST requests to:
```
POST http://localhost:8080/eswaradithya/admins/save
```

### Request Body
```json
{
  "email": "admin@example.com",
  "passwordHash": "plain_password_here",
  "name": "John Doe",
  "role": "admin"
}
```

### Success Response (201)
```json
{
  "statusCode": 2001,
  "message": "Admin created Successfully",
  "data": {
    "adminId": 1,
    "email": "admin@example.com",
    "name": "John Doe",
    "role": "admin",
    "createdAt": "2026-04-18T15:48:00"
  }
}
```

### Error Response (400)
```json
{
  "statusCode": 4001,
  "message": "Email already exists. Please choose a different email"
}
```

## Customization

### Change API Endpoint
Edit `src/components/AdminForm.jsx` line 60:
```javascript
'http://localhost:8080/eswaradithya/admins/save'
```

### Change Colors
Edit `tailwind.config.js` to customize the color theme.

### Add More Fields
Add new input fields in the form and update the state in `AdminForm.jsx`.

## License

MIT
