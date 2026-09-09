import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, isLiveFirebaseConfigured } from '../services/firebase';
import {
  getCloudUsers,
  getCloudUserById,
  updateCloudUser,
  seedFirestoreDatabase,
} from '../services/cloudStorage';
import { SEED_STUDENTS, SEED_ADMIN } from '../services/seedData';

const AuthContext = createContext();

export function calculateProfileStrength(user) {
  if (!user || user.role === 'admin') return 100;

  let score = 0;
  const missing = [];

  if (user.name) score += 10;
  if (user.avatar) score += 10;
  if (user.college && user.department) score += 15;
  if (user.year) score += 5;

  if (user.bio && user.bio.length > 20) {
    score += 15;
  } else {
    missing.push('Add a detailed bio (at least 20 chars)');
  }

  const skillCount = (user.technicalSkills || []).length;
  if (skillCount >= 5) {
    score += 25;
  } else if (skillCount >= 2) {
    score += 15;
    missing.push(`Add ${5 - skillCount} more technical skills to boost match accuracy`);
  } else {
    missing.push('Add at least 3 technical skills');
  }

  const interestCount = (user.interests || []).length;
  if (interestCount >= 3) {
    score += 10;
  } else {
    missing.push('Select at least 3 interest categories');
  }

  const techCount = (user.preferredTechnologies || []).length;
  if (techCount >= 3) {
    score += 10;
  } else {
    missing.push('Add preferred technologies');
  }

  return {
    score: Math.min(100, score),
    missing,
    isComplete: score >= 85,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ── Firebase live mode ──
        if (isLiveFirebaseConfigured && auth) {
          // Seed Firestore if empty
          await seedFirestoreDatabase();

          // Sign in anonymously (required for Firestore rules)
          await signInAnonymously(auth);

          // Restore the last active profile from localStorage
          const savedUserId = localStorage.getItem('smc_active_user_id') || 'user-alex';
          const user = await getCloudUserById(savedUserId);
          setCurrentUser(user || SEED_STUDENTS[0]);
        } else {
          // ── Local / fallback mode ──
          const savedUserId = localStorage.getItem('smc_active_user_id') || 'user-alex';
          const user = await getCloudUserById(savedUserId);
          setCurrentUser(user || SEED_STUDENTS[0]);
        }
      } catch (err) {
        console.warn('Auth init error, using fallback:', err);
        setCurrentUser(SEED_STUDENTS[0]);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const users = await getCloudUsers();
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      // Ensure we're signed in (Firebase anonymous auth or local)
      if (isLiveFirebaseConfigured && auth && !auth.currentUser) {
        try { await signInAnonymously(auth); } catch { /* already signed in */ }
      }
      setCurrentUser(found);
      localStorage.setItem('smc_active_user_id', found.id);
      return { success: true, user: found };
    }
    throw new Error('Invalid email or password. You can also use 1-Click Demo accounts below.');
  };

  const register = async (userData) => {
    const users = await getCloudUsers();
    const existing = users.find((u) => u.email?.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      experienceLevel: userData.experienceLevel || 'Intermediate',
      technicalSkills: userData.technicalSkills || [],
      softSkills: userData.softSkills || ['Teamwork', 'Problem Solving'],
      interests: userData.interests || ['Artificial Intelligence', 'Web Development'],
      preferredTechnologies: userData.preferredTechnologies || ['React', 'Python'],
      createdAt: new Date().toISOString(),
      ...userData,
    };

    // Persist to Firestore / localStorage via updateCloudUser (creates the doc)
    await updateCloudUser(newUser.id, newUser);
    setCurrentUser(newUser);
    localStorage.setItem('smc_active_user_id', newUser.id);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smc_active_user_id');
  };

  const switchDemoUser = async (userId) => {
    const user = await getCloudUserById(userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('smc_active_user_id', userId);
      window.dispatchEvent(new Event('cloud_data_updated'));
    }
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    const updated = await updateCloudUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
    return updated;
  };

  const profileStrength = calculateProfileStrength(currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        switchDemoUser,
        updateUserProfile,
        isAdmin: currentUser?.role === 'admin',
        isStudent: currentUser?.role === 'student',
        profileStrength,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
