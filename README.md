# ☕ CAFÉNOVA – Café Management & Ordering Platform

**Good Coffee, Great Moments.**

CaféNova is a full-stack café management and ordering platform with separate **Customer** and **Admin** experiences. Customers can explore the menu, place orders, send messages, and leave reviews, while administrators can manage orders, customer conversations, menu data, and reviews.

## 🌐 Live Demo

**Customer Website:**
https://cafenova-blx4.onrender.com

**Backend API:**
https://cafenova-backend-lfo0.onrender.com

## ✨ Features

### 👤 Customer Side

* Customer registration and login
* JWT-based authentication
* Browse café menu and categories
* Add items to cart
* Place orders
* View order information
* Send messages to the café
* Leave reviews
* View submitted reviews
* Customer account and logout

### 🛠️ Admin Side

* Secure admin login
* Admin dashboard
* View and manage orders
* View customer conversations
* Reply to customer messages
* Delete customer chats from the admin view
* View customer reviews
* Permanently delete reviews
* Manage café operations from one dashboard

## 🎨 Design

* Modern café-inspired interface
* Responsive layout
* Clean navigation
* Separate customer and admin interfaces
* Coffee-themed visual design
* Mobile-friendly experience

## 💻 Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB Atlas

### Authentication & Security

* JSON Web Token (JWT)
* bcrypt password hashing
* Role-based access control

### Deployment

* Render – Frontend
* Render – Backend
* MongoDB Atlas – Database

## 📁 Project Structure

```text
CafeNova/
│
├── client/
│   ├── landing.html
│   ├── landing.css
│   ├── admin.html
│   └── images/
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YerraboinaManeesha/CafeNova.git
cd CafeNova
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

Add your MongoDB connection string and JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the backend

```bash
node server.js
```

The backend will run locally on:

```text
http://localhost:5000
```

### 5. Run the frontend

Open:

```text
client/landing.html
```

in your browser.

## 🔐 Authentication

CaféNova uses JWT-based authentication.

* Customers can create accounts and log in.
* Administrators use a separate admin login.
* User roles are determined by the backend.
* Passwords are securely hashed using bcrypt.

## 🚀 Deployment

The project is deployed using **Render**.

```text
Customer Browser
       ↓
CaféNova Frontend
       ↓
Node.js + Express Backend
       ↓
MongoDB Atlas
```

## 📌 GitHub Repository

https://github.com/YerraboinaManeesha/CafeNova

## 👩‍💻 Author

**Maneesha Yerraboina**

MSc Computer Science Graduate
Full Stack Web Development | JavaScript | Node.js | Express.js | MongoDB

---


