# 🚀 RUNNING MEGA CAR SYSTEM

## Current Status: ✅ RUNNING

### Servers Status
- ✅ **Backend Server**: Running on http://localhost:3000
- ✅ **Frontend Server**: Running on http://localhost:8000
- ⏳ **MongoDB**: Not installed locally (optional - use MongoDB Atlas if needed)

---

## 🌐 Access Your Application

### Main URLs
- **Home Page**: http://localhost:8000
- **Register**: http://localhost:8000/frontend/pages/register.html
- **Login**: http://localhost:8000/frontend/pages/login.html
- **API**: http://localhost:3000/api

---

## 🧪 Test the System

### 1. Register New User
1. Go to: http://localhost:8000/frontend/pages/register.html
2. Fill in the form:
   - Name: Test User
   - Email: test@megacar.com
   - Phone: +964750000000
   - Password: test123
   - City: Dohok
3. Click "Register"

### 2. Login
1. Go to: http://localhost:8000/frontend/pages/login.html
2. Login with your credentials
3. You'll be redirected to User Dashboard

### 3. Test Features
- Browse cars on home page
- Filter cars by brand/price
- Access user dashboard
- Update customization settings

---

## 📝 Terminal Commands

### To Start Backend Again
```bash
cd /Users/ehabtechconsultancy/Desktop/mega_cars/backend
node server.js
# or
npm start
```

### To Start Frontend Again
```bash
cd /Users/ehabtechconsultancy/Desktop/mega_cars/frontend
python3 -m http.server 8000
```

### To Stop Servers
```bash
# Stop backend (Ctrl+C in the backend terminal)
# Stop frontend (Ctrl+C in the frontend terminal)
```

---

## ⚠️ If You Get Errors

### "Port Already in Use"
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill the process on port 8000
lsof -ti:8000 | xargs kill -9
```

### "MongoDB Connection Error"
This is normal - MongoDB isn't installed. The system will work without it for testing.

To fix: Install MongoDB or use MongoDB Atlas cloud database

### "API Not Responding"
1. Make sure backend is running (check terminal)
2. Refresh browser page
3. Check browser console for errors (F12)

---

## 🛠️ Next Steps

### To Install MongoDB Locally
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh --eval "db.version()"
```

### To Use MongoDB Atlas (Cloud)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in `.env` file

---

## 📊 Configuration Files

- **Backend Config**: `/backend/.env`
- **Backend Server**: `/backend/server.js`
- **Frontend Config**: JS files in `/frontend/js/`

### Current .env Settings
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mega_cars
JWT_SECRET=mega_car_super_secret_jwt_key_change_in_production_2026
NODE_ENV=development
```

---

## ✅ System Ready!

Your Mega Car dealership system is now running and ready to test!

**Enjoy! 🚗**
