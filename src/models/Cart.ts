import mongoose from 'mongoose';


const CartItemSchema = new mongoose.Schema({
  product: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
  },
  quantity: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
});

export default mongoose.model('Cart', CartSchema);