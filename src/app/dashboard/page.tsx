'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import { toggleHabitCompletion } from '@/lib/habits';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('habit-tracker-session');
    if (!sessionStr) {
      router.push('/login');
      return;
    }

    const session = JSON.parse(sessionStr);
    setSessionUserId(session.userId);

    const allHabitsStr = localStorage.getItem('habit-tracker-habits');
    const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];
    
    setHabits(allHabits.filter((h) => h.userId === session.userId));
    setIsLoading(false);
  }, [router]);

  const saveHabitsToStorage = (newHabits: Habit[]) => {
    setHabits(newHabits);
    const allHabitsStr = localStorage.getItem('habit-tracker-habits');
    const allHabits: Habit[] = allHabitsStr ? JSON.parse(allHabitsStr) : [];
    
    const otherUsersHabits = allHabits.filter(h => h.userId !== sessionUserId);
    localStorage.setItem('habit-tracker-habits', JSON.stringify([...otherUsersHabits, ...newHabits]));
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      const updatedHabits = habits.map(h => 
        h.id === editingHabit.id ? { ...h, name: habitData.name!, description: habitData.description || '' } : h
      );
      saveHabitsToStorage(updatedHabits);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: sessionUserId!,
        name: habitData.name!,
        description: habitData.description || '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      saveHabitsToStorage([...habits, newHabit]);
    }
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    saveHabitsToStorage(habits.filter(h => h.id !== id));
  };

  const handleToggleComplete = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map(h => h.id === habit.id ? updatedHabit : h);
    saveHabitsToStorage(updatedHabits);
  };

  const handleLogout = () => {
    localStorage.removeItem('habit-tracker-session');
    router.push('/login');
  };

  if (isLoading) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Habits</h1>
          <button 
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium"
          >
            Logout
          </button>
        </div>

        {!isFormOpen && (
          <button 
            data-testid="create-habit-button"
            onClick={() => { setEditingHabit(null); setIsFormOpen(true); }}
            className="mb-6 bg-green-600 text-white px-4 py-2 rounded font-medium"
          >
            + Create Habit
          </button>
        )}

        {isFormOpen && (
          <HabitForm 
            initialHabit={editingHabit} 
            onSave={handleSaveHabit} 
            onCancel={() => { setIsFormOpen(false); setEditingHabit(null); }} 
          />
        )}

        {habits.length === 0 && !isFormOpen ? (
          <div data-testid="empty-state" className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No habits found.</p>
          </div>
        ) : (
          <div>
            {habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onEdit={(h) => { setEditingHabit(h); setIsFormOpen(true); }}
                onDelete={handleDeleteHabit}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}