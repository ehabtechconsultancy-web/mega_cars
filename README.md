# Mega Car - Car Dealership Management System

A comprehensive web-based car dealership management system built for **Mega Car** in Dohok, Iraq. This system enables users to browse and purchase cars, manage sales and installments, and provides admins with complete control over the platform.

## 🎯 Overview

Mega Car is a full-featured dealership management solution with:
- **Home Page** - About us, featured cars, contact information
- **User System** - Registration, login, profiles, customization
- **Shopping** - Browse cars, filter by price/brand, purchase with installments
- **Admin Panel** - Manage inventory, users, sales, and generate reports
- **Role-Based Access** - Separate dashboards for users and admins
- **Customizable UI** - Font size, theme, language preferences

## 📋 Features

### For Customers
- ✅ Browse car inventory with advanced filtering
- ✅ Purchase cars with flexible payment options
- ✅ Create and manage installment plans
- ✅ List your car for sale
- ✅ Customize interface (font size, theme, language)
- ✅ Track purchase history
- ✅ Manage payment schedules

### For Admins
- ✅ Complete inventory management
- ✅ User account management
- ✅ Sales tracking and reports
- ✅ Revenue analytics
- ✅ System configuration
- ✅ Role-based permissions

### Additional Features
- ✅ Secure JWT authentication
- ✅ Password encryption with bcrypt
- ✅ Responsive mobile-friendly design
- ✅ Multiple payment methods support
- ✅ Installment plan automation
- ✅ Sales & revenue reports
- ✅ Multi-language support (English & Arabic)
- ✅ Dark/Light theme toggle

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Responsive Grid & Flexbox Layout

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose ODM
- JWT Authentication
- bcryptjs Password Hashing
- Multer File Uploads
- PDFKit & Nodemailer

## 📁 Project Structure

```
mega_cars/
├── frontend/
│   ├── index.html                    # Home page
│   ├── css/
│   │   ├── styles.css               # Main styles
│   │   ├── auth.css                 # Auth pages
│   │   ├── dashboard.css            # User dashboard
│   │   └── admin-dashboard.css      # Admin dashboard
│   ├── js/
│   │   ├── auth.js                  # Auth logic
│   │   ├── main.js                  # Home page
│   │   ├── dashboard.js             # User dashboard
│   │   └── admin-dashboard.js       # Admin dashboard
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   └── admin-dashboard.html
│   └── images/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   ├── Sale.js
│   │   ├── Purchase.js
│   │   └── Installment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── sales.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── customization.js
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   └── config/
├── references/                       # Logo & images
└── README.md

```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
# Start server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend

# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx http-server -p 8000

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Access: `http://localhost:8000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Add car (admin)
- `PUT /api/cars/:id` - Update car (admin)
- `DELETE /api/cars/:id` - Delete car (admin)

### Sales & Installments
- `POST /api/sales` - Create sale
- `GET /api/sales` - Get user sales
- `POST /api/sales/installment/create` - Create installment plan
- `GET /api/sales/installment/plans` - Get installment plans

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/profile/:id` - Get profile
- `PUT /api/users/profile/:id` - Update profile
- `DELETE /api/users/:id` - Delete user (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/reports/sales` - Sales reports
- `PUT /api/admin/users/:id/role` - Change user role

### Customization
- `PUT /api/customization/settings/:userId` - Update settings
- `GET /api/customization/settings/:userId` - Get settings

## 🗄️ Database Models

### User
```javascript
{
  name, email, phone, password, role (admin/user),
  address, city, country, customization,
  profileImage, isActive
}
```

### Car
```javascript
{
  brand, model, year, price, mileage,
  color, fuel, transmission, bodyType, condition,
  description, images, vin, plateNumber,
  status, owner, features
}
```

### Sale
```javascript
{
  car, buyer, seller, salePrice, saleDate,
  paymentMethod, status, notes, documents
}
```

### Installment
```javascript
{
  sale, car, buyer, totalAmount, downPayment,
  numberOfInstallments, installmentAmount,
  interestRate, frequency, installments[],
  status
}
```

## 👥 User Roles

### Admin
- Manage car inventory (add, edit, delete)
- Manage user accounts
- View sales reports and analytics
- System configuration
- Full dashboard access

### Regular User
- Browse and purchase cars
- Create installment plans
- List car for sale
- View purchase history
- Customize interface settings

## 🔐 Authentication

- JWT token-based authentication
- Secure password hashing with bcryptjs
- Role-based access control
- Token expiration handling

## 🎨 Customization Features

Users can customize their interface:
- **Font Size**: 12px - 18px
- **Theme**: Light or Dark mode
- **Language**: English or Arabic
- **Sidebar**: Collapsible navigation

## 📋 Test Credentials

### Create Admin in MongoDB
```javascript
// Insert via MongoDB shell
db.users.insertOne({
  name: "Admin",
  email: "admin@megacar.com",
  phone: "+964750000000",
  role: "admin",
  password: "$2a$10$..." // bcrypt hash
})
```

### Register as User
- Go to Register page
- Fill in details
- Login with credentials

## 🚀 Deployment

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy backend and frontend

### Docker
```dockerfile
FROM node:14
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

### AWS/DigitalOcean
1. Configure server (EC2/Droplet)
2. Install Node.js and MongoDB
3. Deploy with PM2

## ⚙️ Environment Variables

Create `.env` in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mega_cars
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection fails | Ensure MongoDB is running |
| Port already in use | Change PORT in .env |
| CORS error | Check backend CORS settings |
| Token expired | Login again |
| Can't find image | Replace image paths |

## 📞 Support

**Mega Car Dealership**
- Location: Dohok, Iraq
- Email: info@megacar.com
- Phone: +964 (0) XXX XXXX XXX

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics dashboard
- [ ] Customer review system
- [ ] Live chat support
- [ ] SMS notifications
- [ ] Vehicle tracking with GPS
- [ ] Insurance integration

## 📄 License

© 2026 Mega Car Dealership. All rights reserved.

---

**Status**: ✅ Ready for Development & Deployment
**Last Updated**: May 25, 2026
**Version**: 1.0.0