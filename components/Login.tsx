
import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onCreateAccount: (user: Omit<User, 'id' | 'notificationSettings'>) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onCreateAccount, users }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('caregiver@example.com');
  const [password, setPassword] = useState('password');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleForgotPassword = () => {
    alert('Password reset instructions have been sent to your email address.');
  };

  const toggleAuthMode = () => {
    setIsSignUp(prev => !prev);
    setErrors({});
    if (!isSignUp) {
        setEmail('');
        setPassword('');
    } else {
        setEmail('caregiver@example.com');
        setPassword('password');
    }
    setFullName('');
    setConfirmPassword('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (isSignUp) {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
      if (users.some(u => u.email === email)) newErrors.email = 'An account with this email already exists.';
    } else {
        if (!email) newErrors.email = 'Email is required.';
        if (!password) newErrors.password = 'Password is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (isSignUp) {
        const newUser = { name: fullName, email, password };
        onCreateAccount(newUser);
    } else {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setErrors({ form: 'Invalid email or password. Please try again.' });
        }
    }
  };

  return (
    <div className="min-h-screen bg-brand-background-light dark:bg-brand-background-dark flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h1 className="ml-3 text-4xl font-bold text-brand-text-primary dark:text-brand-text-primary_dark">CareConnect</h1>
            </div>
          <p className="text-brand-text-secondary dark:text-brand-text-secondary_dark">Your partner in compassionate care.</p>
           <h2 className="mt-6 text-2xl font-bold text-brand-text-primary dark:text-brand-text-primary_dark">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.form && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/50 p-3 rounded-md">{errors.form}</p>}
          {isSignUp && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Full Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark" />
             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Password</label>
            <input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark" />
             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {isSignUp && (
             <div>
              <label htmlFor="confirm-password"className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Confirm Password</label>
              <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
          <div className="flex items-center justify-end">
             {!isSignUp && ( <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-brand-blue hover:text-brand-blue-dark"> Forgot your password? </button> )}
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition">
              {isSignUp ? 'Create Account' : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-center text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleAuthMode} className="font-medium text-brand-blue hover:text-brand-blue-dark">
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default Login;
