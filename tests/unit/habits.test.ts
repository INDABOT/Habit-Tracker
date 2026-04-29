import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Read',
    description: '',
    frequency: 'daily',
    createdAt: '2026-04-29',
    completions: ['2026-04-28']
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-29');
    expect(result.completions).toContain('2026-04-29');
    expect(result.completions.length).toBe(2);
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-28');
    expect(result.completions).not.toContain('2026-04-28');
    expect(result.completions.length).toBe(0);
  });

  it('does not mutate the original habit object', () => {
    toggleHabitCompletion(mockHabit, '2026-04-29');
    expect(mockHabit.completions).toEqual(['2026-04-28']); // Original remains unchanged
  });

  it('does not return duplicate completion dates', () => {
    // Force a duplicate into the original state to test cleanup/set behavior
    const corruptedHabit = { ...mockHabit, completions: ['2026-04-28', '2026-04-28'] };
    const result = toggleHabitCompletion(corruptedHabit, '2026-04-29');
    expect(result.completions).toEqual(['2026-04-28', '2026-04-29']);
  });
});