import mongoose from 'mongoose';
import Product from '../models/Product';  // Assuming you have Product model created
import dotenv from 'dotenv';

dotenv.config();

async function fetchAndStoreProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    await mongoose.connect(process.env.MONGO_URI!);

    for (const product of products) {
      const newProduct = new Product({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating.rate,
        ratingCount: product.rating.count,
      });
      await newProduct.save();
    }

    console.log('Products have been stored successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error fetching or storing products:', error);
  }
}

fetchAndStoreProducts();