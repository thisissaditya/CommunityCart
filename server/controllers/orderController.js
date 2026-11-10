import Order from '../models/Order.js';
import { initialOrders } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let ordersCache = [...initialOrders];

const generateSmsMessage = (orderNumber, storeName, status, totalAmount, riderName = 'Raju') => {
  switch (status) {
    case 'Placed':
      return `[CommunityCart Rural Gateway] Order #${orderNumber} placed at ${storeName}. Total: ₹${totalAmount} (COD). Shopkeeper notified.`;
    case 'Accepted':
      return `[CommunityCart] Great news! ${storeName} accepted order #${orderNumber}. Preparing your fresh village order now.`;
    case 'Preparing':
      return `[CommunityCart] Order #${orderNumber} is being freshly cooked/packed at ${storeName}.`;
    case 'Out for Delivery':
      return `[CommunityCart] Order #${orderNumber} is OUT FOR DELIVERY! Village rider ${riderName} is en route to your doorstep.`;
    case 'Delivered':
      return `[CommunityCart] Order #${orderNumber} was DELIVERED successfully! Paid in cash. Thank you for supporting local village shops.`;
    case 'Cancelled':
      return `[CommunityCart] Order #${orderNumber} has been cancelled.`;
    default:
      return `[CommunityCart] Status update for order #${orderNumber}: ${status}`;
  }
};

export const createOrder = async (req, res) => {
  try {
    const { 
      customer, 
      storeId, 
      storeName, 
      items, 
      subtotal, 
      deliveryFee, 
      platformFee, 
      totalAmount, 
      paymentMethod, 
      prescriptionUrl 
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order.' });
    }

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone number are required.' });
    }

    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const calcSubtotal = subtotal || items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const calcDelivery = deliveryFee !== undefined ? deliveryFee : (calcSubtotal > 150 ? 0 : 15);
    const calcPlatform = platformFee !== undefined ? platformFee : 2;
    const calcTotal = totalAmount || (calcSubtotal + calcDelivery + calcPlatform);

    const initialStatus = 'Placed';
    const smsText = generateSmsMessage(orderNumber, storeName || 'Local Village Store', initialStatus, calcTotal);

    const orderPayload = {
      orderNumber,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || 'guest@rampur.in',
        address: customer.address || 'Village Center, Rampur',
        village: customer.village || 'Rampur Panchayat',
      },
      storeId: storeId || 'store-1',
      storeName: storeName || 'Sharma Ji Ka Mess & Dhaba',
      items: items.map(it => ({
        productId: it.id || it.productId || `prod-${Date.now()}`,
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        unit: it.unit || '1 item',
        category: it.category || 'food',
        isVeg: it.isVeg !== false,
        image: it.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      })),
      subtotal: calcSubtotal,
      deliveryFee: calcDelivery,
      platformFee: calcPlatform,
      totalAmount: calcTotal,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: new Date(),
          note: `Order placed via ${paymentMethod || 'Cash on Delivery'}`,
        },
      ],
      prescriptionUrl: prescriptionUrl || null,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      smsNotification: {
        sent: true,
        lastMessage: smsText,
        recipientPhone: customer.phone,
        timestamp: new Date(),
      },
    };

    if (getDBStatus()) {
      const newOrder = await Order.create(orderPayload);
      return res.status(201).json({ success: true, order: newOrder });
    }

    const mockOrder = {
      id: `ord-${Date.now()}`,
      ...orderPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ordersCache.unshift(mockOrder);
    return res.status(201).json({ success: true, order: mockOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;

    if (getDBStatus()) {
      const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    const userOrders = ordersCache.filter(
      (o) => o.customer?.email?.toLowerCase() === email?.toLowerCase()
    );
    res.json({ success: true, count: userOrders.length, orders: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const { storeName } = req.params;

    if (getDBStatus()) {
      const query = storeName && storeName !== 'all' 
        ? { storeName: { $regex: storeName, $options: 'i' } }
        : {};
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    let vendorOrders = [...ordersCache];
    if (storeName && storeName !== 'all') {
      vendorOrders = vendorOrders.filter((o) =>
        o.storeName?.toLowerCase().includes(storeName.toLowerCase())
      );
    }
    res.json({ success: true, count: vendorOrders.length, orders: vendorOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (getDBStatus()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    }

    res.json({ success: true, count: ordersCache.length, orders: ordersCache });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, riderName } = req.body;

    const validStatuses = ['Placed', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (getDBStatus()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`,
      });

      const smsText = generateSmsMessage(order.orderNumber, order.storeName, status, order.totalAmount, riderName);
      order.smsNotification = {
        sent: true,
        lastMessage: smsText,
        recipientPhone: order.customer.phone,
        timestamp: new Date(),
      };

      if (status === 'Delivered') {
        order.paymentStatus = 'Completed';
      }

      await order.save();
      return res.json({ success: true, order });
    }

    const order = ordersCache.find((o) => o.id === id || o._id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status changed to ${status}`,
    });

    const smsText = generateSmsMessage(order.orderNumber, order.storeName, status, order.totalAmount, riderName);
    order.smsNotification = {
      sent: true,
      lastMessage: smsText,
      recipientPhone: order.customer?.phone,
      timestamp: new Date().toISOString(),
    };

    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

