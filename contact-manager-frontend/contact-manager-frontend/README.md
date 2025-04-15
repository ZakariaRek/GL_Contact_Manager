# Contact Manager - React Frontend

This is a modern React frontend for a contact management system that connects to an Express.js backend API.

## Features

- 👤 Manage contacts with detailed information
- 🏷️ Create and manage contact groups for better organization
- 🔍 Advanced search and filtering capabilities
- 📤 Import and export contacts
- 📱 Fully responsive design for mobile and desktop
- 🎨 Clean and intuitive user interface

## Tech Stack

- React 18
- React Router v6 for navigation
- Context API for state management
- Custom hooks for data fetching and form handling
- Axios for API communication
- React Hot Toast for notifications
- React Icons for UI icons

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- Backend API running (Express.js)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/contact-manager-frontend.git
cd contact-manager-frontend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory and add your backend API URL
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server
```
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
contact-manager/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── contacts/
│   │   ├── groups/
│   │   ├── layout/
│   │   └── common/
│   ├── services/
│   ├── context/
│   ├── utils/
│   ├── pages/
│   ├── hooks/
│   ├── App.jsx
│   ├── index.js
│   └── styles/
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the backend API using the following endpoints:

- **Contacts**
  - GET `/contacts` - Get all contacts
  - GET `/contacts/:id` - Get a contact by ID
  - POST `/contacts` - Create a new contact
  - PUT `/contacts/:id` - Update a contact
  - DELETE `/contacts/:id` - Delete a contact
  - POST `/contacts/import` - Import contacts
  - GET `/contacts/export` - Export contacts

- **Groups**
  - GET `/groups` - Get all groups
  - GET `/groups/:id` - Get a group by ID
  - POST `/groups` - Create a new group
  - PUT `/groups/:id` - Update a group
  - DELETE `/groups/:id` - Delete a group
  - GET `/groups/:id/contacts` - Get contacts in a group

## Future Enhancements

- Authentication and user management
- Contact favorites
- Contact sharing
- Dark mode
- Mobile app using React Native

## License

This project is licensed under the MIT License