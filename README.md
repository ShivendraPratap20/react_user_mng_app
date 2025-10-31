#  React User Management App

A full-stack MERN application that allows users to **create, manage, and update their accounts** with profile pictures.  
Includes secure authentication using **JWT stored in cookies**, **Cloudinary integration** for image uploads, and is fully **deployed online** (frontend + backend).

## 🚀 Live Demo

- 🌐 **Demo Link:** [https://reactusermngapp.vercel.app](https://reactusermngapp.vercel.app)

## 📋 Features

✅ **User Registration & Login** — Secure auth using JWT cookies  
✅ **Profile Management** — Update username, phone, and profile photo  
✅ **Cloudinary Integration** — For fast, optimized image hosting  
✅ **Protected Routes** — Accessible only after login    
✅ **Responsive UI** — Built with React & Tailwind CSS  
✅ **Deployed & Live** — Frontend (Vercel), Backend (Render)

## 🚀 Technology Stack

### Frontend
- ReactJS
- React Hooks (Custom Hook)
- Tailwind CSS for responsive design

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (in-memory upload)
- Cloudinary (for images)
- JWT Authentication (via cookies)
- CORS configured for Vercel + Render

### Database
- **MongoDB** 
- **MongoDB Atlas**

### Version Control
- **Git** 

### Deployment
- Frontend → [Vercel](https://vercel.com/)
- Backend →  [Render](https://render.com/)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

## Project Structure
```
react_user_mng_app/
├── client/
│   ├── src/
│   │    ├── components/
|   |    |      ├── Modal.jsx
|   |    |      └── ProfileCard.jsx
|   |    ├── context/
|   |    |      └── AuthContext
|   |    |              └── auth.js
|   |    ├── hooks/
|   |    |      └── userApi.js
|   |    ├── pages/
|   |    |      ├── Home.jsx
|   |    |      ├── SignIn.jsx
|   |    |      └── SignUp.jsx
|   |    └── schemas
|   |            └── VallidationSchema.js
│   ├── public/images
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
|   |   |      └──cloudinary.js
│   │   ├── controller/
|   |   |       └──userCtrl.js
│   │   ├── db/
|   |   |   ├── model/
|   |   |   |    └──userModel.js
|   |   |   └── conn.js 
|   |   ├──middleware/
|   |   |     ├── auth.js
|   |   |     ├── multer.js
|   |   |     └── validation.js
│   │   ├── routes/
|   |   |     └── index.js
│   │   ├── utils/
|   |   |      └── validator.js
|   |   └── index.js       
│   └── package.json
└── README.md
```

## 📦 Installation & Setup
### Prerequisites
- Node.js (latest LTS version)
- npm or yarn package manager
- Database (MongoDB)
- Git

### Clone the Repository
```bash
git clone https://github.com/ShivendraPratap20/react_user_mng_app.git
cd ./react_user_mng_app
```

### Backend Setup
```bash
cd ./server
npm install
```
Create a `.env` file in the backend directory:
```env
DB_CONN_URI=<your-database-connection-string>
SECRET_KEY=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloudinary-user-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-secret-key>
```

### Start the backend server:
```bash
cd ./server
npm start
```

### Frontend Setup
```bash
cd ./client
npm install
npm run dev
```

## 📝 API Endpoints

### Base URL
```http
https://react-user-mng-app.onrender.com
```
| Method | Endpoint                 | Description                              |
| :----- | :----------------------- | :--------------------------------------- |
| `GET`  | `/auth`                | For user Authentication            |
| `POST`  | `/signin`        | For user signin |
| `POST`  | `/register`        | For registering new user |
| `PUT`  | `/updateData`          | For updating existing user's data |
| `GET` | `/logout`       | For logging out |
| `DELETE` | `/deleteData/:id`       | For removing/deleting the user's data |

## 📜 License

This project is open source.

## 👋 Author

Shivnedra Pratap
💼 Full Stack Developer (MERN Developer)
- LinkedIn → www.linkedin.com/in/shivendra-pratap-bb7304293
- GitHub →  https://github.com/ShivendraPratap20/
