const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Update customization settings
router.put('/settings/:userId', auth, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { fontSize, theme, language, sidebarCollapsed } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        'customization.fontSize': fontSize,
        'customization.theme': theme,
        'customization.language': language,
        'customization.sidebarCollapsed': sidebarCollapsed
      },
      { new: true }
    );
    
    res.json(user.customization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get customization settings
router.get('/settings/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('customization');
    res.json(user.customization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
