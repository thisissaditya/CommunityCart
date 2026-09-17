import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { initialStores, initialProducts } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let storesCache = [...initialStores];
let productsCache = [...initialProducts];

export const getStores = async (req, res) => {
  try {
    const { category, village } = req.query;

    if (getDBStatus()) {
      const query = {};
      if (category && category !== 'all') query.category = category;
      if (village) query.village = village;
      const stores = await Store.find(query);
      return res.json({ success: true, count: stores.length, stores });
    }

    let result = [...storesCache];
    if (category && category !== 'all') {
      result = result.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (village && village !== 'all') {
      result = result.filter((s) => s.village.toLowerCase().includes(village.toLowerCase()));
    }

    res.json({ success: true, count: result.length, stores: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const store = await Store.findById(id);
      if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
      const products = await Product.find({ storeId: id });
      return res.json({ success: true, store, products });
    }

    const store = storesCache.find((s) => s.id === id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    const products = productsCache.filter((p) => p.storeId === id);

    res.json({ success: true, store, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, storeId } = req.query;

    if (getDBStatus()) {
      const query = {};
      if (category && category !== 'all') query.category = category;
      if (storeId) query.storeId = storeId;
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      const products = await Product.find(query);
      return res.json({ success: true, count: products.length, products });
    }

    let result = [...productsCache];
    if (category && category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (storeId) {
      result = result.filter((p) => p.storeId === storeId);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, storeName, category, subcategory, price, originalPrice, unit, description, isVeg } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, and category' });
    }

    if (getDBStatus()) {
      const newProd = await Product.create({
        name,
        storeName: storeName || 'My Village Shop',
        category,
        subcategory: subcategory || 'General',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price),
        unit: unit || '1 item',
        description: description || '',
        isVeg: isVeg !== false,
      });
      return res.status(201).json({ success: true, product: newProd });
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      name,
      storeId: 'store-1',
      storeName: storeName || 'Sharma Ji Ka Mess & Dhaba',
      category,
      subcategory: subcategory || 'General',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) + 15,
      unit: unit || '1 item',
      description: description || 'Fresh locally provided item',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80',
      inStock: true,
      isVeg: isVeg !== false,
    };

    productsCache.unshift(newProd);
    res.status(201).json({ success: true, product: newProd });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProductStock = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      product.inStock = !product.inStock;
      await product.save();
      return res.json({ success: true, product });
    }

    const product = productsCache.find((p) => p.id === id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.inStock = !product.inStock;

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
