import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Storage key for authentication data
const AUTH_STORAGE_KEY = 'streembuddie-auth';

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const derivePasswordHash = async(password, salt) => {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user from localStorage on initial render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register a new user
  const register = async (email, password, name) => {
    try {
      setError('');
      setLoading(true);
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('streembuddie-users') || '[]');
      const emailNorm = email.trim().toLowerCase();
      const existingUser = storedUsers.find(user => (user.email || '').toLowerCase() === emailNorm);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const passwordHash = await derivePasswordHash(password, salt);
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        passwordHash,
        salt: Array.from(salt),
        createdAt: new Date().toISOString()
      };
      
      // Save user to "database" (localStorage)
      localStorage.setItem('streembuddie-users', JSON.stringify([...storedUsers, newUser]));
      
      // Log in the user
      const userToStore = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      
      return userToStore;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Log in a user
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Get users from "database" (localStorage)
      const storedUsers = JSON.parse(localStorage.getItem('streembuddie-users') || '[]');
      const emailNorm = email.trim().toLowerCase();
      const user = storedUsers.find(user => (user.email || '').toLowerCase() === emailNorm);
      if (user) {
        const salt = new Uint8Array(user.salt);
        const hash = await derivePasswordHash(password, salt);
        if (hash !== user.passwordHash) {
          throw new Error('Invalid email or password');
        }
      }

      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store user in localStorage and state
      const userToStore = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      
      return userToStore;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Log out a user
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};