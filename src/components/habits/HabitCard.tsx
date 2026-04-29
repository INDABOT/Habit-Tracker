import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { useState } from 'react';

export default function HabitCard({ 
  habit, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}: { 
  habit: Habit, 
  onEdit: (h: Habit) => void, 
  onDelete: (id: string) => void, 
  onToggleComplete: (h: Habit) => void 
}) {
  const slug = getHabitSlug(habit.name);
  const [showConfirm, setShowConfirm] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompletedToday = habit.completions.includes(today);

  return (
    <div data-testid={`habit-card-${slug}`} className="border p-4 rounded mb-4 bg-white shadow-sm flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{habit.name}</h3>
        {habit.description && <p className="text-gray-600 text-sm">{habit.description}</p>}
        <p data-testid={`habit-streak-${slug}`} className="text-sm mt-2 text-blue-600 font-medium">
          Streak: {streak}
        </p>
      </div>
      
      <div className="flex gap-2 items-center">
        <button 
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`px-3 py-1 rounded text-white ${isCompletedToday ? 'bg-green-600' : 'bg-gray-400'}`}
        >
          {isCompletedToday ? 'Done' : 'Mark Done'}
        </button>
        <button 
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="px-3 py-1 rounded bg-yellow-500 text-white"
        >
          Edit
        </button>
        
        {showConfirm ? (
          <button 
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit.id)}
            className="px-3 py-1 rounded bg-red-700 text-white font-bold"
          >
            Confirm
          </button>
        ) : (
          <button 
            data-testid={`habit-delete-${slug}`}
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1 rounded bg-red-500 text-white"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}