const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            console.log(`[PAGE LOG] ${msg.text()}`);
        }
    });
    
    page.on('pageerror', err => {
        console.error(`[PAGE ERROR] ${err.toString()}`);
    });
    
    console.log('Navigating to index.html...');
    await page.goto('file:///C:/Users/HP/.gemini/antigravity/scratch/ecotech-museum-3d/index.html', { waitUntil: 'networkidle0' });
    
    console.log('Waiting 2 seconds to let scripts run...');
    await new Promise(r => setTimeout(r, 2000));
    
    await browser.close();
    console.log('Done.');
})();
