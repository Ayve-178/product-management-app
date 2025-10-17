'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/redux/api/apiSlice';
import { setToken } from '@/redux/slices/authSlice';

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setError(null);

    try {
      const result = await login({ email }).unwrap();
      dispatch(setToken(result.token));
      router.push('/');
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-anti-flash-white px-4">
      <div className="max-w-sm w-full">
        <h1 className="text-xl font-semibold mb-4 text-center">Welcome to Product Management App</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-chestnut mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-rich-black text-white py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
