export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!today || completions.length === 0) return 0;

  // Remove duplicates and sort descending
  const uniqueDates = Array.from(new Set(completions)).sort().reverse();
  
  if (!uniqueDates.includes(today)) return 0;

  let streak = 0;
  const [y, m, d] = today.split('-').map(Number);
  let currentDate = new Date(y, m - 1, d);

  for (const dateStr of uniqueDates) {
    if (dateStr > today) continue; // Ignore future dates if any somehow got in
    
    const expectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    if (dateStr === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // step back one day
    } else if (dateStr < expectedDateStr) {
      break; // gap found, streak broken
    }
  }

  return streak;
}