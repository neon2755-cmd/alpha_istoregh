const Config = require('../models/Config');

// @desc    Get site configuration
// @route   GET /api/config
// @access  Public
const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({}); // Create default if it doesn't exist
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching config' });
  }
};

// @desc    Update site configuration
// @route   PUT /api/config
// @access  Private/Admin
const updateConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config(req.body);
    } else {
      config.branding = req.body.branding || config.branding;
      config.hero = req.body.hero || config.hero;
      config.promo = req.body.promo || config.promo;
      config.contact = req.body.contact || config.contact;
      config.delivery = req.body.delivery || config.delivery;
    }

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating config' });
  }
};

module.exports = {
  getConfig,
  updateConfig,
};
