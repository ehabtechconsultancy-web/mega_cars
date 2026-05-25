# Mega Car - Configuration & Setup Instructions

## 🚀 Initial Setup

### Step 1: Backend Configuration

#### 1.1 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 1.2 Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

#### 1.3 Configure MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not already installed)
# macOS with Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify MongoDB is running
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env
```

#### 1.4 Update .env File
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mega_cars
JWT_SECRET=your_super_secret_key_here_change_in_production
NODE_ENV=development
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

#### 1.5 Start Backend Server
```bash
# Start server
npm start

# For development with auto-reload (requires nodemon)
npm run dev
```

Server should show:
```
Server running on port 5000
MongoDB connected
```

---

### Step 2: Frontend Configuration

#### 2.1 Start Frontend Server

**Option A: Python (Recommended for macOS)**
```bash
cd frontend
python -m http.server 8000
```

**Option B: Node.js http-server**
```bash
cd frontend
npx http-server -p 8000
```

**Option C: VS Code Live Server**
```
1. Install "Live Server" extension in VS Code
2. Right-click index.html
3. Select "Open with Live Server"
```

#### 2.2 Access Application
```
Home Page: http://localhost:8000
Login: http://localhost:8000/frontend/pages/login.html
Register: http://localhost:8000/frontend/pages/register.html
```

---

## 👤 Creating Test Users

### Method 1: Register via Web Interface

1. Go to: `http://localhost:8000/frontend/pages/register.html`
2. Fill in the form:
   - Name: John Doe
   - Email: user@megacar.com
   - Phone: +964750000000
   - Password: password123
   - Address: Main Street
   - City: Dohok
3. Click Register
4. Login with credentials

### Method 2: Create Admin via MongoDB

```bash
# Connect to MongoDB
mongosh

# Select database
use mega_cars

# Insert admin user (password is already hashed in code)
db.users.insertOne({
  name: "Admin User",
  email: "admin@megacar.com",
  phone: "+964750000000",
  password: "$2a$10$KIX.c8jX.L.JQjJtcBJMd.w6gDzIgXbfqPVzCVmZqhCLvQ8p1HT0C", // bcrypt hash of "admin123"
  role: "admin",
  address: "Admin Street",
  city: "Dohok",
  country: "Iraq",
  isActive: true,
  customization: {
    fontSize: 14,
    theme: "light",
    language: "en",
    sidebarCollapsed: false
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Then login with:
- Email: `admin@megacar.com`
- Password: `admin123`

---

## 🗄️ Database Setup

### Create Sample Data

```bash
mongosh
use mega_cars

# Create Cars
db.cars.insertMany([
  {
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    price: 25000,
    mileage: 5000,
    color: "Silver",
    fuel: "petrol",
    transmission: "automatic",
    bodyType: "sedan",
    condition: "new",
    description: "Brand new Toyota Camry with full warranty",
    status: "available",
    features: ["Air Conditioning", "Power Windows", "GPS Navigation"]
  },
  {
    brand: "BMW",
    model: "3 Series",
    year: 2020,
    price: 35000,
    mileage: 45000,
    color: "Black",
    fuel: "diesel",
    transmission: "automatic",
    bodyType: "sedan",
    condition: "used",
    description: "Well-maintained BMW with service records",
    status: "available",
    features: ["Leather Seats", "Sunroof", "Navigation"]
  }
])

# Verify
db.cars.find().pretty()
```

---

## 🔐 Security Checklist

Before deployment, ensure:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS/SSL certificate
- [ ] Configure CORS for your domain
- [ ] Setup rate limiting
- [ ] Enable HTTPS in frontend API calls
- [ ] Implement request logging
- [ ] Setup monitoring and alerting
- [ ] Regular security audits
- [ ] Backup database regularly

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Login page accessible
- [ ] Register page accessible
- [ ] Forms validate inputs
- [ ] Responsive design on mobile

### Backend Testing
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] CORS is configured
- [ ] Error handling works

### User Flow Testing
- [ ] User can register
- [ ] User can login
- [ ] User dashboard loads
- [ ] Can browse cars
- [ ] Can view car details
- [ ] Can purchase car
- [ ] Can create installment
- [ ] Can update settings
- [ ] Customization saves
- [ ] Logout works

### Admin Flow Testing
- [ ] Admin can login
- [ ] Admin dashboard shows stats
- [ ] Can add new car
- [ ] Can edit car
- [ ] Can delete car
- [ ] Can view users
- [ ] Can view sales reports
- [ ] Can manage settings

---

## 📝 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@megacar.com",
    "phone": "+964750000000",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@megacar.com",
    "password": "password123"
  }'
```

### Get All Cars
```bash
curl http://localhost:5000/api/cars
```

### Add Car (Admin - requires token)
```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "brand": "Honda",
    "model": "Civic",
    "year": 2023,
    "price": 22000,
    "mileage": 0,
    "status": "available"
  }'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoServerError: connect ECONNREFUSED

Solution:
1. Ensure MongoDB is running: brew services start mongodb-community
2. Check MongoDB URI in .env
3. Verify MongoDB is listening on port 27017
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### CORS Error in Browser
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Check backend CORS settings in server.js
2. Ensure frontend URL is allowed
3. Frontend and backend must be on different ports
```

### Token Expired
```
Error: Invalid token

Solution:
1. Login again to get new token
2. Check token expiration time in auth.js
3. Clear browser localStorage
```

### Images Not Loading
```
Solution:
1. Check image paths in HTML files
2. Ensure images exist in /frontend/images/
3. Use relative paths for images
```

---

## 📦 Deployment Guide

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create mega-car-dealership

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy backend
git push heroku main:main

# Deploy frontend (separate)
# Build React/static version or use separate frontend hosting
```

### Deploy to AWS

```bash
# Create EC2 instance
# Install Node.js
sudo yum install nodejs

# Install MongoDB
# Or use AWS DocumentDB

# Upload code
scp -r backend/ ubuntu@your_instance:/var/www/

# Start service
pm2 start server.js
```

### Deploy with Docker

```dockerfile
# backend/Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t mega-car-backend .
docker run -p 5000:5000 mega-car-backend
```

---

## 📊 Monitoring & Logging

### Enable Request Logging
```javascript
// Add to server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Database Monitoring
```javascript
// Monitor MongoDB connections
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

### Error Logging
```javascript
// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});
```

---

## 🔄 Backup & Recovery

### Backup MongoDB
```bash
# Backup database
mongodump --db mega_cars --out ./backup

# Restore database
mongorestore --db mega_cars ./backup/mega_cars
```

### Backup Files
```bash
# Backup code
tar -czf mega_cars_backup.tar.gz backend/ frontend/

# Restore
tar -xzf mega_cars_backup.tar.gz
```

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [JWT Authentication](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)

---

## ✅ Pre-Launch Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB running and connected
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can access home page
- [ ] Can register and login
- [ ] Can browse cars
- [ ] Admin dashboard works
- [ ] All features tested
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Documentation complete

---

## 🎯 Next Actions

1. **Day 1**: Setup and test locally
2. **Day 2-3**: Customize content and branding
3. **Day 4**: Test all features thoroughly
4. **Day 5**: Deploy to staging
5. **Day 6**: User acceptance testing
6. **Day 7**: Deploy to production

---

## 📞 Support

For issues or questions:
- Check QUICKSTART.md for quick fixes
- Review API documentation in README.md
- Check MongoDB connection
- Verify environment variables
- Check browser console for errors
- Check server logs

**Company**: Mega Car Dealership
**Location**: Dohok, Iraq
**Email**: info@megacar.com

---

**Last Updated**: May 25, 2026
**Version**: 1.0.0
**Status**: Ready for Deployment
