const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  downPayment: {
    type: Number,
    required: true
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  numberOfInstallments: {
    type: Number,
    required: true
  },
  installmentAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
    default: 'monthly'
  },
  installments: [{
    installmentNumber: Number,
    dueDate: Date,
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date,
    paymentMethod: String,
    notes: String
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Installment', InstallmentSchema);
