'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@/types/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('habit-tracker-users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    const newSession: Session = {
      userId: user.id,
      email: user.email,
    };

    localStorage.setItem('habit-tracker-session', JSON.stringify(newSession));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            data-testid="auth-login-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            data-testid="auth-login-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          data-testid="auth-login-submit"
          className="bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}