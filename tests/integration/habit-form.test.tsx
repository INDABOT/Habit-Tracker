import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../../src/app/dashboard/page';

// THE FIX: A stable reference object so React doesn't infinitely loop
const mockRouter = { push: vi.fn() };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Stub crypto for JSDOM so it doesn't hang when creating a habit
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 9)
});

describe('habit form', () => {
  const mockSession = { userId: '1', email: 'test@example.com' };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('habit-tracker-session', JSON.stringify(mockSession));
    vi.clearAllMocks();
  });

  it('shows a validation error when habit name is empty', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(screen.getByText('Habit name is required')).toBeDefined();
  });

  it('creates a new habit and renders it in the list', () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-card-drink-water')).toBeDefined();
  });

  it('edits an existing habit and preserves immutable fields', () => {
    const initialHabit = {
      id: 'h1', userId: '1', name: 'Read', description: '', frequency: 'daily', createdAt: '2026-01-01', completions: []
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([initialHabit]));

    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('habit-edit-read'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Read Books' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-card-read-books')).toBeDefined();
    
    const stored = JSON.parse(localStorage.getItem('habit-tracker-habits')!);
    expect(stored[0].id).toBe('h1'); // Immutable ID preserved
    expect(stored[0].createdAt).toBe('2026-01-01'); // Immutable date preserved
  });

  it('deletes a habit only after explicit confirmation', () => {
    const initialHabit = {
      id: 'h1', userId: '1', name: 'Yoga', description: '', frequency: 'daily', createdAt: '2026-01-01', completions: []
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([initialHabit]));

    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId('habit-delete-yoga'));
    
    // Explicit confirmation button should appear
    expect(screen.getByTestId('confirm-delete-button')).toBeDefined();
    
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(screen.queryByTestId('habit-card-yoga')).toBeNull(); // Removed from UI
  });

  it('toggles completion and updates the streak display', () => {
    const initialHabit = {
      id: 'h1', userId: '1', name: 'Code', description: '', frequency: 'daily', createdAt: '2026-01-01', completions: []
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([initialHabit]));

    render(<DashboardPage />);
    const streakEl = screen.getByTestId('habit-streak-code');
    expect(streakEl.textContent).toContain('0');

    // Toggle completion for today
    fireEvent.click(screen.getByTestId('habit-complete-code'));
    expect(streakEl.textContent).toContain('1'); // Streak instantly updates
  });
});