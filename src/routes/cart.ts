// routes/cart.ts
import express, { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import auth from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user!.id });
    if (!cart) {
      cart = new Cart({ user: req.user!.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/remove', auth, async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user!.id });
    if (cart) {
      cart.items.pull({ product: productId });
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-quantity', auth, async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user!.id });
    if (cart) {
      const item = cart.items.find(item => item.product.toString() === productId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/apply-discount', auth, async (req: AuthRequest, res: Response) => {
  const { discountCode } = req.body;
  try {
    // Implement discount logic here
    // For example, you could have a Discount model and check if the code is valid
    // Then apply the discount to the cart total
    res.json({ message: 'Discount applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;