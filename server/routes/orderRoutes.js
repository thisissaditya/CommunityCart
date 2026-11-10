import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getVendorOrders, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/user/:email', getUserOrders);
router.get('/vendor/:storeName', getVendorOrders);
router.patch('/:id/status', updateOrderStatus);
router.put('/:id/status', updateOrderStatus);

export default router;

