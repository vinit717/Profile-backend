import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  expiresAt: { type: Date },
});

export default mongoose.model('Discount', DiscountSchema);