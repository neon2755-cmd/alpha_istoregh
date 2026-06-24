const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, delivery, payment, guestInfo, promoCode, discount } = req.body;

    if (!items?.length) return res.status(400).json({ success: false, message: 'No order items' });

    // Calculate subtotal from DB prices (never trust client)
    let subtotal = 0;
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });

      const variant = product.variants.find(v =>
        v.storage === item.variant?.storage && v.color?.name === item.variant?.color
      ) || product.variants[0];

      const price = variant?.price || product.basePrice;
      subtotal += price * item.quantity;

      enrichedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price,
        quantity: item.quantity,
        variant: item.variant,
      });

      // Decrement stock
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
      product.totalSold += item.quantity;
      await product.save();
    }

    const total = subtotal + (delivery?.fee || 0) - (discount || 0);

    const order = await Order.create({
      user:     req.user?._id,
      guestInfo: req.user ? undefined : guestInfo,
      items:    enrichedItems,
      delivery,
      payment,
      promoCode,
      discount: discount || 0,
      subtotal,
      total,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    const customerEmail = req.user?.email || guestInfo?.email;

    try {
      const itemsList = order.items.map(item =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">GHS ${item.price * item.quantity}</td>
        </tr>`
      ).join('');

      if (customerEmail) {
        await sendEmail({
          to: customerEmail,
          subject: `Order Confirmed — #${order.orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
              <h2 style="color: #006989;">Alpha iStore</h2>
              <h3 style="color: #0f172a;">Your order is confirmed!</h3>
              <p style="color: #475569;">Thank you for your order. We will contact you shortly to confirm delivery.</p>
              <p><strong>Order Number:</strong> #${order.orderNumber}</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: center;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemsList}</tbody>
              </table>
              <p style="font-size: 18px; font-weight: bold; color: #006989;">Total: GHS ${order.total}</p>
              <p style="color: #94a3b8; font-size: 12px;">Alpha iStore · Adum P.Z, Kumasi, Ghana</p>
            </div>
          `,
        });
      }

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Order #${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #006989;">New Order Received</h2>
            <p><strong>Order:</strong> #${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.user?.firstName || order.guestInfo?.firstName || 'Guest'} — ${customerEmail || 'No email'}</p>
            <p><strong>Total:</strong> GHS ${order.total}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery:</strong> ${order.delivery?.method} — ${order.delivery?.region || ''}</p>
            <p style="color: #94a3b8; font-size: 12px;">Log in to admin panel to manage this order.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/my (customer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('items.product', 'name images');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/track/:orderNumber (public)
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user', 'firstName lastName email'),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status changed to ${status}` });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/orders/clear (admin) — delete all orders
exports.clearAllOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ success: true, message: `Deleted ${result.deletedCount} orders` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/dashboard-stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, delivered, processing, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'processing' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, sold: { $sum: '$items.quantity' } } },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        delivered,
        processing,
        revenue: revenue[0]?.total || 0,
        topProducts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
