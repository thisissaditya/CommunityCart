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
      if (search && search.trim()) {
        const s = search.trim();
        query.$or = [
          { name: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
          { subcategory: { $regex: s, $options: 'i' } },
          { storeName: { $regex: s, $options: 'i' } },
        ];
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
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.storeName?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const popularSearches = [
      'Shudh Ghee Thali',
      'Paneer Butter Masala',
      'Dal Makhani',
      'Khasta Samosa',
      'Desi Ghee Jalebi',
      'Chakki Atta',
      'Paracetamol 650mg',
      'Kulhad Chai',
      'Chole Bhature',
      'Mustard Oil',
      'Fresh Buffalo Milk',
      'Dal Baati Churma',
    ];

    if (!q) {
      return res.json({
        success: true,
        popularSearches,
        suggestions: popularSearches.slice(0, 5),
        products: [],
        stores: [],
      });
    }

    if (getDBStatus()) {
      const productMatches = await Product.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { subcategory: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ],
      }).limit(5);

      const storeMatches = await Store.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ],
      }).limit(3);

      const suggestions = [
        ...new Set([
          ...productMatches.map((p) => p.name),
          ...storeMatches.map((s) => s.name),
          ...popularSearches.filter((term) => term.toLowerCase().includes(q)),
        ]),
      ].slice(0, 6);

      return res.json({
        success: true,
        query: q,
        popularSearches,
        suggestions,
        products: productMatches,
        stores: storeMatches,
      });
    }

    // In-memory fallback
    const productMatches = productsCache
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const storeMatches = storesCache
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const suggestions = [
      ...new Set([
        ...productMatches.map((p) => p.name),
        ...storeMatches.map((s) => s.name),
        ...popularSearches.filter((term) => term.toLowerCase().includes(q)),
      ]),
    ].slice(0, 6);

    res.json({
      success: true,
      query: q,
      popularSearches,
      suggestions,
      products: productMatches,
      stores: storeMatches,
    });
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

export const bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of products' });
    }

    if (getDBStatus()) {
      const created = await Product.insertMany(products);
      return res.status(201).json({ success: true, count: created.length, products: created });
    }

    const added = products.map((item, index) => ({
      id: `prod-${Date.now()}-${index}`,
      name: item.name,
      storeId: item.storeId || 'store-1',
      storeName: item.storeName || 'Sharma Ji Ka Mess & Dhaba',
      category: item.category || 'food',
      subcategory: item.subcategory || 'General',
      price: Number(item.price) || 50,
      originalPrice: item.originalPrice ? Number(item.originalPrice) : (Number(item.price) || 50) + 15,
      unit: item.unit || '1 item',
      description: item.description || 'Authentic local item',
      image: item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      inStock: item.inStock !== false,
      isVeg: item.isVeg !== false,
    }));

    productsCache.unshift(...added);
    res.status(201).json({ success: true, count: added.length, products: added });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
