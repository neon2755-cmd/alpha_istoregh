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
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
