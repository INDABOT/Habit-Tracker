'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      password, // Note: Local testing only per TRD
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
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
            className="w-full border p-2 rounded"
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
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          data-testid="auth-signup-submit"
          className="bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}