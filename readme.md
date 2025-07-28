# 🛒 EduBot E-Commerce Web App

This is a full-stack e-commerce website built with **MERN stack** using **Vite**, **Tailwind CSS**, **MongoDB**, **Express**, **React**, and **Node.js**. It supports full admin and user functionalities including product browsing, cart management, and order processing.

---

## 🔧 Folder Structure
```
EDUBOT-ECOM/
├── backend/
│ ├── controllers/
│ │ ├── cartController.js
│ │ ├── categoryController.js
│ │ ├── orderController.js
│ │ ├── productController.js
│ │ └── userController.js
│ ├── middleware/
│ │ ├── auth.js
│ │ └── role.js
│ ├── models/
│ │ ├── CartItem.js
│ │ ├── Category.js
│ │ ├── Order.js
│ │ ├── Product.js
│ │ └── User.js
│ ├── routes/
│ │ ├── categoryRoutes.js
│ │ ├── orderRoutes.js
│ │ ├── productRoutes.js
│ │ └── userRoutes.js
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│ └── server.js
│
├── src/
│ ├── components/
│ │ ├── CartSidebar.jsx
│ │ ├── Header.jsx
│ │ ├── Layout.jsx
│ │ ├── ProductCard.jsx
│ │ ├── ProtectedRoute.jsx
│ │ └── ToastContainer.jsx
│ ├── contexts/
│ │ ├── CartContext.jsx
│ │ ├── ToastContext.jsx
│ │ └── UserContext.jsx
│ ├── pages/
│ │ ├── AdminCategories.jsx
│ │ ├── AdminDashboard.jsx
│ │ ├── AdminOrders.jsx
│ │ ├── AdminProducts.jsx
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── ProductDetail.jsx
│ │ ├── Profile.jsx
│ │ └── Register.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── postcss.config.js
├── readme.md
├── tailwind.config.js
└── vite.config.js
```
---

## 🧪 Environment Variables
Create a `.env` file inside the `backend/` folder with the following content:

```env
PORT=port number
MONGODB_URL=mongodb url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=num of days
```

---
```
1. Clone the Repository
2. Setup Backend
     cd backend
     npm install
     npm run dev---
3. Setup Frontend
     cd ../
     npm install
     npm run dev
```
