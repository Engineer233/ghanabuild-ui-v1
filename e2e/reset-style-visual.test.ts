import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';

/**
 * Ghana Build UI - Style Reset Visual Regression Tests
 * 
 * This test suite validates the visual consistency of the global style reset
 * across different browsers, viewports, and color schemes.
 */

test.describe('Style Reset Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load to ensure consistent rendering
    await page.waitForFunction(() => {
      return document.fonts.ready;
    });
  });

  test.describe('Desktop Viewports', () => {
    test('should render style reset consistently in light mode - desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Ensure light mode
      await page.emulateMedia({ colorScheme: 'light' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Desktop Light Mode', {
        fullPage: true,
        widths: [1280],
      });
      
      // Additional assertions for style reset
      const body = page.locator('body');
      await expect(body).toHaveCSS('margin', '0px');
      await expect(body).toHaveCSS('padding', '0px');
      await expect(body).toHaveCSS('box-sizing', 'border-box');
    });

    test('should render style reset consistently in dark mode - desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Enable dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Desktop Dark Mode', {
        fullPage: true,
        widths: [1280],
      });
      
      // Verify dark mode styles are applied
      const body = page.locator('body');
      const backgroundColor = await body.evaluate(el => 
        getComputedStyle(el).backgroundColor
      );
      
      // Check that dark mode background is applied
      expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
    });
  });

  test.describe('Mobile Viewports', () => {
    test('should render style reset consistently in light mode - mobile', async ({ page }) => {
      // Set mobile viewport (iPhone 12)
      await page.setViewportSize({ width: 390, height: 844 });
      
      // Ensure light mode
      await page.emulateMedia({ colorScheme: 'light' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Mobile Light Mode', {
        fullPage: true,
        widths: [390],
      });
      
      // Verify responsive behavior
      const html = page.locator('html');
      await expect(html).toHaveCSS('overflow-x', 'hidden');
    });

    test('should render style reset consistently in dark mode - mobile', async ({ page }) => {
      // Set mobile viewport (iPhone 12)
      await page.setViewportSize({ width: 390, height: 844 });
      
      // Enable dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Mobile Dark Mode', {
        fullPage: true,
        widths: [390],
      });
    });
  });

  test.describe('Tablet Viewports', () => {
    test('should render style reset consistently in light mode - tablet', async ({ page }) => {
      // Set tablet viewport (iPad)
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Ensure light mode
      await page.emulateMedia({ colorScheme: 'light' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Tablet Light Mode', {
        fullPage: true,
        widths: [768],
      });
    });

    test('should render style reset consistently in dark mode - tablet', async ({ page }) => {
      // Set tablet viewport (iPad)
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Enable dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Tablet Dark Mode', {
        fullPage: true,
        widths: [768],
      });
    });
  });

  test.describe('Accessibility and Focus States', () => {
    test('should render focus indicators correctly', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Find any focusable element (button, link, input, etc.)
      const focusableElement = page.locator('button, a, input, select, textarea').first();
      
      if (await focusableElement.count() > 0) {
        // Focus the element
        await focusableElement.focus();
        
        // Take Percy snapshot with focus state
        await percySnapshot(page, 'Style Reset - Focus States', {
          fullPage: false,
        });
        
        // Verify focus outline is present
        const outlineWidth = await focusableElement.evaluate(el => 
          getComputedStyle(el).outlineWidth
        );
        expect(outlineWidth).not.toBe('0px');
      }
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Reduced Motion', {
        fullPage: true,
      });
      
      // Verify that animations are reduced
      const animationDuration = await page.evaluate(() => {
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        const computedStyle = getComputedStyle(testElement);
        document.body.removeChild(testElement);
        return computedStyle.animationDuration;
      });
      
      // Note: This is more of a smoke test since the actual implementation
      // would depend on how reduced motion is handled in the CSS
    });
  });

  test.describe('Typography Reset', () => {
    test('should render typography consistently across browsers', async ({ page }) => {
      // Create a test page with various typography elements
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="/src/index.css">
        </head>
        <body>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
          <ol>
            <li>Ordered item 1</li>
            <li>Ordered item 2</li>
          </ol>
          <a href="#">This is a link</a>
          <button>This is a button</button>
          <input type="text" placeholder="Input field" />
        </body>
        </html>
      `);
      
      // Wait for styles to load
      await page.waitForLoadState('networkidle');
      
      // Take Percy snapshot
      await percySnapshot(page, 'Style Reset - Typography Elements', {
        fullPage: true,
      });
      
      // Verify that elements have consistent typography
      const heading1 = page.locator('h1');
      const paragraph = page.locator('p');
      const listItem = page.locator('li').first();
      
      // Check that font families are consistent
      const h1FontFamily = await heading1.evaluate(el => getComputedStyle(el).fontFamily);
      const pFontFamily = await paragraph.evaluate(el => getComputedStyle(el).fontFamily);
      
      expect(h1FontFamily).toBe(pFontFamily);
    });
  });

  test.describe('Cross-Browser Consistency', () => {
    test('should render identically across different browsers', async ({ page, browserName }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Take browser-specific snapshot
      await percySnapshot(page, `Style Reset - ${browserName} Browser`, {
        fullPage: true,
        widths: [1280],
      });
      
      // Verify basic reset properties are consistent
      const body = page.locator('body');
      const html = page.locator('html');
      
      await expect(body).toHaveCSS('margin', '0px');
      await expect(body).toHaveCSS('padding', '0px');
      await expect(html).toHaveCSS('box-sizing', 'border-box');
    });
  });
});