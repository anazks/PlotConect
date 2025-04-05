import express from 'express';
import Order from '../models/orderModel.js';

import User from '../models/userModel.js';
import auctionModel from '../models/auctionModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

import expressAsyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);
// ✅ Create Razorpay instance outside the route to avoid re-instantiation
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_1XVQVdAljbnAgC",
  key_secret: "zm0iZjUHUs16huCXBxpS8RZZ",
});

// ✅ Route: Create Razorpay Order
orderRouter.post(
  '/createOrder',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { amount } = req.body;

      // ✅ Basic validation
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing amount',
        });
      }

      const options = {
        amount: amount, // amount in paisa
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1,
      };

      console.log('Creating Razorpay order:', options);

      const response = await razorpayInstance.orders.create(options);

      console.log('Razorpay order created:', response);

      res.status(200).json({
        success: true,
        order: response,
      });

    } catch (error) {
      console.error('Error in /createOrder:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order',
        error: error?.message || 'Unknown error',
      });
    }
  })
);
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({
        ...item,
        product: item._id,
      })),

      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({
      message: 'New Order Created',
      order: order.toObject({ getters: true }),
    });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const myOctions = await auctionModel.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/getMyOction/:name',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('req.params.name', req.params.name);
    const myOctions = await auctionModel.find({ 
      $or: [
        { user: req.params.name },        // Auctions created by the user
        { "bids.bidder": req.params.name } // Auctions where user has placed a bid
      ]
    });
    console.log('myOctions', myOctions);
    res.send(myOctions);
  })
);
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.findByIdAndDelete(req.params.id);
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid Successfully', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
