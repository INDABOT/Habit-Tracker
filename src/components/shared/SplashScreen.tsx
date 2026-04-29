'use client';

export default function SplashScreen() {
  return (
    <div 
      data-testid="splash-screen" 
      className="fixed inset-0 flex items-center justify-center bg-white"
    >
      <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
    </div>
  );
}