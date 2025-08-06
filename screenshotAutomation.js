const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const url = process.env.SITE_URL || 'https://www.ghanabuildai.com';
  if (!fs.existsSync('artifacts')) fs.mkdirSync('artifacts');
  // Add your screenshot logic here
})();