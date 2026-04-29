import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

export default function HabitForm({
  initialHabit,
  onSave,
  onCancel
}: {
  initialHabit?: Habit | null;
  onSave: (habitData: Partial<Habit>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily'>('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setFrequency(initialHabit.frequency);
    }
  }, [initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error || 'Error');
      return;
    }

    onSave({
      name: validation.value,
      description,
      frequency
    });
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50 mb-6">
      <h3 className="font-bold text-lg mb-4">{initialHabit ? 'Edit Habit' : 'New Habit'}</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
        <input
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Frequency</label>
        <select
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'daily')}
          className="w-full border p-2 rounded"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" data-testid="habit-save-button" className="bg-blue-600 text-white px-4 py-2 rounded font-medium">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded font-medium">
          Cancel
        </button>
      </div>
    </form>
  );
}