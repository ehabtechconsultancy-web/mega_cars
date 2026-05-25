const express = require('express');
const Car = require('../models/Car');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const { status, brand, fuel, transmission, minPrice, maxPrice, minYear, maxYear } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (brand) filter.$or = [
      { brand: new RegExp(brand, 'i') },
      { model: new RegExp(brand, 'i') }
    ];
    if (fuel) filter.fuel = fuel;
    if (transmission) filter.transmission = transmission;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = parseInt(minYear);
      if (maxYear) filter.year.$lte = parseInt(maxYear);
    }

    const cars = await Car.find(filter).populate('owner', 'name phone email').sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new car (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update car (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete car (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
