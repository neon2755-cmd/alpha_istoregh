const Settings = require('../models/Settings');

const getOrCreate = async () => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
};

// GET /api/settings (public)
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/settings (admin)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      if (req.body.storeName) settings.storeName = req.body.storeName;
      if (req.body.logo) settings.logo = { ...settings.logo, ...req.body.logo };
      if (req.body.favicon) settings.favicon = { ...settings.favicon, ...req.body.favicon };
      if (req.body.hero) settings.hero = { ...settings.hero, ...req.body.hero };
      if (req.body.contact) settings.contact = { ...settings.contact, ...req.body.contact };
      if (req.body.social) settings.social = { ...settings.social, ...req.body.social };
      if (req.body.payment) settings.payment = { ...settings.payment, ...req.body.payment };
      if (req.body.promoBanners) settings.promoBanners = req.body.promoBanners;
      if (req.body.delivery) settings.delivery = { ...settings.delivery, ...req.body.delivery };
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
