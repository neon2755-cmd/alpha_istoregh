const ContactMessage = require('../models/ContactMessage');

// POST /api/contact (public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/contact (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/contact/:id/reply (admin)
exports.markReplied = async (req, res) => {
  try {
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    contact.replied = !contact.replied;
    await contact.save();
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/contact/:id (admin)
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
