import { test, expect } from '@playwright/test';

test.describe('Ghanabuild.AI Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Ghanabuild\.AI/);
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Ghanabuild.AI');
    
    // Check if the subtitle is visible
    await expect(page.locator('p')).toContainText('Advanced House Cost Estimator');
  });

  test('should display the project form', async ({ page }) => {
    // Check if the form heading is visible
    await expect(page.locator('h2')).toContainText('Enter Your Project Details');
    
    // Check if all required form fields are present
    await expect(page.locator('input[name="region"]')).toBeVisible();
    await expect(page.locator('select[name="projectType"]')).toBeVisible();
    await expect(page.locator('input[name="totalFloorArea"]')).toBeVisible();
    await expect(page.locator('input[name="numberOfBathrooms"]')).toBeVisible();
    await expect(page.locator('input[name="numberOfFloors"]')).toBeVisible();
    await expect(page.locator('select[name="preferredFinishQuality"]')).toBeVisible();
    await expect(page.locator('input[name="includeExternalWorks"]')).toBeVisible();
    
    // Check if the submit button is present
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Get Cost Estimate');
  });

  test('should validate form inputs and show validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check if validation modal appears
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"] h3')).toContainText('Validation Error');
    
    // Close the modal
    await page.click('button:text("Close")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should fill out form and submit successfully', async ({ page }) => {
    // Fill out the form with valid data
    await page.fill('input[name="region"]', 'Greater Accra');
    await page.selectOption('select[name="projectType"]', 'residential');
    await page.fill('input[name="totalFloorArea"]', '2500');
    await page.fill('input[name="numberOfBathrooms"]', '3');
    await page.fill('input[name="numberOfFloors"]', '2');
    await page.selectOption('select[name="preferredFinishQuality"]', 'standard');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the loading state
    await expect(page.locator('text=Calculating...')).toBeVisible({ timeout: 1000 });
    
    // Wait for the estimate result (this might take a few seconds)
    await expect(page.locator('h2:text("Cost Estimate")')).toBeVisible({ timeout: 20000 });
    
    // Check if the total cost is displayed
    await expect(page.locator('text=Total Estimated Cost')).toBeVisible();
    
    // Check if cost breakdown is shown
    await expect(page.locator('text=Cost Breakdown')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock a network error by intercepting the API call
    await page.route('**/api/estimate', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Fill out and submit the form
    await page.fill('input[name="region"]', 'Greater Accra');
    await page.fill('input[name="totalFloorArea"]', '2500');
    await page.fill('input[name="numberOfBathrooms"]', '3');
    await page.fill('input[name="numberOfFloors"]', '2');
    await page.click('button[type="submit"]');
    
    // Check if error is displayed
    await expect(page.locator('text=Error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Try Again')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if the layout adapts to mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2:text("Enter Your Project Details")')).toBeVisible();
    
    // Check if form is still accessible
    await expect(page.locator('input[name="region"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form accessibility
    await expect(page.locator('label[for="region"]')).toBeVisible();
    await expect(page.locator('label[for="totalFloorArea"]')).toBeVisible();
    await expect(page.locator('label[for="numberOfBathrooms"]')).toBeVisible();
    await expect(page.locator('label[for="numberOfFloors"]')).toBeVisible();
    
    // Check if required fields are marked
    await expect(page.locator('input[name="region"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="totalFloorArea"]')).toHaveAttribute('required');
    
    // Check modal accessibility
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toHaveAttribute('aria-modal', 'true');
  });

  test('should load main JavaScript bundles', async ({ page }) => {
    // Check if the main JS bundle loads
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('.js')) {
        responses.push(response);
      }
    });
    
    await page.reload();
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check if at least one JS bundle was loaded successfully
    const successfulJsLoads = responses.filter(response => 
      response.status() === 200 && response.url().includes('.js')
    );
    
    expect(successfulJsLoads.length).toBeGreaterThan(0);
  });

  test('should have working footer', async ({ page }) => {
    // Check if footer is present
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Ghanabuild.AI');
    await expect(page.locator('footer')).toContainText('All rights reserved');
  });
});