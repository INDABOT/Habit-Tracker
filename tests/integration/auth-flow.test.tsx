import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from '../../src/components/auth/SignupForm';
import LoginForm from '../../src/components/auth/LoginForm';

// Mock the Next.js router so our test components don't crash when trying to redirect
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    // Clear storage and mocks before every single test to ensure a clean slate
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);
    
    // Simulate user typing
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    
    // Simulate click
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    // Assert local storage was updated
    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');

    expect(users.length).toBe(1);
    expect(users[0].email).toBe('test@example.com');
    expect(session).not.toBeNull();
    expect(session.email).toBe('test@example.com');

    // Assert Next.js router tried to redirect to dashboard
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', () => {
    // Pre-populate a user in local storage to simulate an existing account
    localStorage.setItem('habit-tracker-users', JSON.stringify([{ 
      id: '1', email: 'test@example.com', password: 'password123', createdAt: new Date().toISOString() 
    }]));
    
    render(<SignupForm />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    // Assert the exact TRD error message appears and NO redirect happens
    expect(screen.getByText('User already exists')).toBeDefined();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', () => {
    // Pre-populate a valid user
    localStorage.setItem('habit-tracker-users', JSON.stringify([{ 
      id: '1', email: 'test@example.com', password: 'password123', createdAt: new Date().toISOString() 
    }]));

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    // Assert session was created
    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('test@example.com');

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    // Assert the exact TRD error message appears
    expect(screen.getByText('Invalid email or password')).toBeDefined();
    expect(mockPush).not.toHaveBeenCalled();
  });
});