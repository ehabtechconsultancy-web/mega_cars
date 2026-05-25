const express = require('express');
const Sale = require('../models/Sale');
const Installment = require('../models/Installment');
const Car = require('../models/Car');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create sale
router.post('/', auth, async (req, res) => {
  try {
    const { carId, salePrice, paymentMethod, notes } = req.body;
    
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    
    const sale = new Sale({
      car: carId,
      buyer: req.user.id,
      seller: car.owner,
      salePrice,
      paymentMethod,
      notes
    });
    
    await sale.save();
    
    // Update car status
    car.status = 'sold';
    await car.save();
    
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = { $or: [{ buyer: req.user.id }, { seller: req.user.id }] };
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

// Create installment plan
router.post('/installment/create', auth, async (req, res) => {
  try {
    const { saleId, downPayment, numberOfInstallments, interestRate, frequency } = req.body;
    
    const sale = await Sale.findById(saleId);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    
    const remainingAmount = sale.salePrice - downPayment;
    const totalWithInterest = remainingAmount + (remainingAmount * interestRate / 100);
    const installmentAmount = totalWithInterest / numberOfInstallments;
    
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    const frequencyDays = {
      'weekly': 7,
      'biweekly': 14,
      'monthly': 30,
      'quarterly': 90
    };
    
    endDate.setDate(endDate.getDate() + (numberOfInstallments * frequencyDays[frequency]));
    
    // Create installment details
    const installments = [];
    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + ((i + 1) * frequencyDays[frequency]));
      
      installments.push({
        installmentNumber: i + 1,
        dueDate,
        amount: installmentAmount,
        paid: false
      });
    }
    
    const installmentPlan = new Installment({
      sale: saleId,
      car: sale.car,
      buyer: sale.buyer,
      totalAmount: sale.salePrice,
      downPayment,
      remainingAmount,
      numberOfInstallments,
      installmentAmount,
      interestRate,
      startDate,
      endDate,
      frequency,
      installments,
      status: 'active'
    });
    
    await installmentPlan.save();
    res.status(201).json(installmentPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get installment plans
router.get('/installment/plans', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = { buyer: req.user.id };
    }
    
    const plans = await Installment.find(filter)
      .populate('car')
      .populate('buyer', 'name email phone');
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
