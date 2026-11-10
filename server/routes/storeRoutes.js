import express from 'express';
import { 
  getStores, 
  getStoreById, 
  getProducts, 
  createProduct, 
  bulkCreateProducts, 
  toggleProductStock 
} from '../controllers/storeController.js';

const router = express.Router();

router.get('/', getStores);
router.get('/products', getProducts);
router.post('/products', createProduct);
router.post('/products/bulk', bulkCreateProducts);
router.patch('/products/:id/toggle-stock', toggleProductStock);
router.get('/:id', getStoreById);

export default router;
