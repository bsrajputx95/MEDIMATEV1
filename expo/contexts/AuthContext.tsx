import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  height: { feet: number; inches: number };
  weight: number;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  medicalConditions: string[];
  isGuest: boolean;
  onboardingCompleted: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'email' | 'isGuest' | 'onboardingCompleted'>) => Promise<void>;
}

const STORAGE_KEYS = {
  USER: 'user_profile',
  AUTH_TOKEN: 'auth_token',
};

export const [AuthProvider, useAuth] = createContextHook((): AuthState => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Don't auto-login as guest - let user choose
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const saveUser = useCallback(async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: UserProfile = {
        id: Date.now().toString(),
        email,
        name: '',
        gender: 'Male',
        age: 0,
        height: { feet: 0, inches: 0 },
        weight: 0,
        bloodGroup: 'A+',
        medicalConditions: [],
        isGuest: false,
        onboardingCompleted: false,
      };
      
      await saveUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: UserProfile = {
        id: Date.now().toString(),
        email,
        name: '',
        gender: 'Male',
        age: 0,
        height: { feet: 0, inches: 0 },
        weight: 0,
        bloodGroup: 'A+',
        medicalConditions: [],
        isGuest: false,
        onboardingCompleted: false,
      };
      
      await saveUser(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  const loginAsGuest = useCallback(async () => {
    setIsLoading(true);
    try {
      const guestData: UserProfile = {
        id: 'guest_' + Date.now(),
        email: 'guest@example.com',
        name: 'Guest User',
        gender: 'Male',
        age: 25,
        height: { feet: 5, inches: 8 },
        weight: 70,
        bloodGroup: 'O+',
        medicalConditions: [],
        isGuest: true,
        onboardingCompleted: true,
      };
      
      await saveUser(guestData);
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUser]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.AUTH_TOKEN]);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...profileUpdate };
      await saveUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [user, saveUser]);

  const completeOnboarding = useCallback(async (profile: Omit<UserProfile, 'id' | 'email' | 'isGuest' | 'onboardingCompleted'>) => {
    if (!user) return;
    
    try {
      const updatedUser: UserProfile = {
        ...user,
        ...profile,
        onboardingCompleted: true,
      };
      await saveUser(updatedUser);
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  }, [user, saveUser]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    loginAsGuest,
    logout,
    updateProfile,
    completeOnboarding,
  }), [user, isLoading, login, signup, loginAsGuest, logout, updateProfile, completeOnboarding]);
});