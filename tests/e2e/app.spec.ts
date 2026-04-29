import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('e2e@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Setup authenticated state
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
    });
    
    await page.goto('/');
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: 'u1', email: 'e2e@example.com', password: 'password' }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'My Habit', frequency: 'daily', completions: [], createdAt: '2026-01-01' }]));
    });

    await page.getByTestId('auth-login-email').fill('e2e@example.com');
    await page.getByTestId('auth-login-password').fill('password');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('habit-card-my-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@test.com' }));
    });
    await page.goto('/dashboard');
    
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'Run', frequency: 'daily', completions: [], createdAt: '2026-01-01' }]));
    });
    await page.goto('/dashboard');

    const streak = page.getByTestId('habit-streak-run');
    await expect(streak).toContainText('0');

    await page.getByTestId('habit-complete-run').click();
    await expect(streak).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'Meditate', frequency: 'daily', completions: [], createdAt: '2026-01-01' }]));
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@test.com' }));
    });
    await page.goto('/dashboard');

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
  });

 test('loads the cached app shell when offline after the app has been loaded once', async ({ context, page }) => {
    // Load once online to let service worker cache it
    await page.goto('/login');
    
    await page.waitForTimeout(1500); 
    
   
    await context.setOffline(true);
    
    
    await page.reload();
    
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });
});