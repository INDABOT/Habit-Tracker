'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- ADD THIS IMPORT
import { User, Session } from '@/types/auth';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('habit-tracker-users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some((u) => u.email === email)) {
      setError('User already exists');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password, 
      createdAt: new Date().toISOString(),
    };

    const newSession: Session = {
      userId: newUser.id,
      email: newUser.email,
    };

    localStorage.setItem('habit-tracker-users', JSON.stringify([...users, newUser]));
    localStorage.setItem('habit-tracker-session', JSON.stringify(newSession));

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            data-testid="auth-signup-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            data-testid="auth-signup-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white/50"
          />
        </div>
        <button
          type="submit"
          data-testid="auth-signup-submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 mt-2"
        >
          Sign Up
        </button>
      </form>

      {/*  NEW SECTION */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>

    </div>
  );
}