const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
    const out32 = path.join(__dirname, '..', 'public', 'favicon-32.png');
    const out180 = path.join(__dirname, '..', 'public', 'favicon-180.png');

    if (!fs.existsSync(svgPath)) {
      console.error('favicon.svg not found in public/');
      process.exit(1);
    }

    const svgBuffer = fs.readFileSync(svgPath);

    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(out32);

    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(out180);

    console.log('Generated favicon-32.png and favicon-180.png in public/');
  } catch (err) {
    console.error('Failed to generate favicons:', err);
    process.exit(1);
  }
})();
