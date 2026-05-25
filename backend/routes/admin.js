const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const Sale = require('../models/Sale');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$salePrice' } } }
    ]);
    
    res.json({
      totalUsers,
      totalCars,
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage users
router.put('/users/:id/role', adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Manage cars
router.post('/cars/add', adminOnly, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate reports
router.get('/reports/sales', adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const sales = await Sale.find(filter)
      .populate('car')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone');
    
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
