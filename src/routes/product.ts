import express from 'express';
import Product from '../models/Product';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;