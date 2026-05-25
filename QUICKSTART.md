# Mega Car - Quick Start Guide

## 🚀 Getting Started

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node
npx http-server -p 8000

# Option 3: Using VS Code Live Server
# Right-click index.html → Open with Live Server
```

Access: `http://localhost:8000`

## 📝 Test Credentials

### Create Admin User in MongoDB
```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin User",
  email: "admin@megacar.com",
  phone: "+964750000000",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "admin",
  city: "Dohok",
  isActive: true,
  createdAt: new Date()
})

// Or register as normal user and manually update role in database
```

### User Test Flow
1. **Register** → Go to `http://localhost:8000/frontend/pages/register.html`
2. **Login** → Go to `http://localhost:8000/frontend/pages/login.html`
3. **Dashboard** → Automatically redirects to dashboard after login

### Admin Test Flow
1. **Login** as admin user
2. **Admin Dashboard** → Automatically redirects to admin panel
3. Manage cars, users, and view reports

## 🗂️ Project Structure Quick Reference

```
mega_cars/
├── frontend/          ← HTML, CSS, JavaScript UI
│   ├── index.html     ← Home page
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html        ← User dashboard
│   │   └── admin-dashboard.html  ← Admin dashboard
│   ├── css/           ← Stylesheets
│   └── js/            ← JavaScript files
├── backend/           ← Node.js/Express API
│   ├── server.js      ← Main server
│   ├── models/        ← Database schemas
│   ├── routes/        ← API endpoints
│   └── package.json
└── references/        ← Logo and images
```

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/cars` | Get all cars |
| POST | `/api/cars` | Add car (admin only) |
| GET | `/api/sales` | Get user sales |
| POST | `/api/sales` | Create sale |
| GET | `/api/users` | Get all users (admin only) |

## 💡 Main Features Implemented

✅ Home page with About Us and car showcase
✅ User registration and login
✅ Role-based access control (Admin & User)
✅ Car inventory management
✅ Sales transaction tracking
✅ Installment plan creation
✅ User customization (font, theme, language)
✅ Admin dashboard with statistics
✅ Responsive design
✅ JWT authentication

## 🛠️ Customization Options

### User Settings (in Dashboard)
- **Font Size**: 12px - 18px slider
- **Theme**: Light or Dark mode
- **Language**: English or Arabic
- **Sidebar**: Collapsible navigation

### Admin Settings
- Company information
- System configuration
- User role management
- Car inventory control

## 📞 Contact & Support

- **Location**: Dohok, Iraq
- **Company**: Mega Car Dealership
- **Email**: info@megacar.com
- **Phone**: +964 (0) XXX XXXX XXX

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Start `mongod` service |
| Port 5000 already in use | Change PORT in `.env` |
| CORS error in frontend | Check backend CORS settings |
| Can't find page | Ensure frontend is running on port 8000 |
| Token expired | Login again to get new token |

## 📚 Next Steps

1. **Integrate Payment Gateway** - Add Stripe/PayPal
2. **Setup Email Notifications** - Configure Nodemailer
3. **Generate PDF Reports** - Implement PDFKit
4. **Deploy to Production** - Use Heroku, AWS, or DigitalOcean
5. **Mobile App Development** - React Native or Flutter

## 🎨 Logo & Images

Your logo and reference images are in `/references` folder:
- `logo.jpeg` - Company logo
- Various car photos for reference

Replace frontend image paths as needed.

---

**Last Updated**: May 25, 2026
**Status**: Ready for Development
