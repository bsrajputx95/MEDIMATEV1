import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, HealthGoal, Achievement, MedicalRecord } from '@/types/profile';

const STORAGE_KEY = 'user_profile_data';

const createDefaultProfile = (): UserProfile => ({
  id: 'user_' + Date.now(),
  personalInfo: {
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
  },
  healthBasics: {
    bloodType: 'O+',
    allergies: ['Peanuts', 'Shellfish'],
    chronicConditions: ['Hypertension'],
    riskFactors: {
      smoking: false,
      alcohol: 'Occasional',
      familyHistory: ['Heart Disease', 'Diabetes'],
    },
    currentDiagnoses: ['Mild Hypertension'],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        type: 'Prescription',
      },
      {
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once daily',
        type: 'Over-the-counter',
      },
    ],
  },
  vitalsStats: {
    bloodPressure: [
      { systolic: 128, diastolic: 82, date: '2024-01-15' },
      { systolic: 125, diastolic: 80, date: '2024-01-10' },
      { systolic: 130, diastolic: 85, date: '2024-01-05' },
    ],
    restingHeartRate: 72,
    weight: 175,
    height: { feet: 5, inches: 10 },
    bmi: 25.1,
    latestLabResults: [
      {
        test: 'Total Cholesterol',
        value: '195 mg/dL',
        normalRange: '<200 mg/dL',
        date: '2024-01-01',
      },
      {
        test: 'HbA1c',
        value: '5.4%',
        normalRange: '<5.7%',
        date: '2024-01-01',
      },
      {
        test: 'Creatinine',
        value: '1.0 mg/dL',
        normalRange: '0.7-1.3 mg/dL',
        date: '2024-01-01',
      },
    ],
  },
  riskTracker: {
    heartRisk: {
      score: 15,
      level: 'Moderate',
      factors: ['Family History', 'Mild Hypertension'],
    },
    diabetesRisk: {
      score: 8,
      level: 'Low',
      factors: ['Family History'],
    },
    kidneyRisk: {
      score: 5,
      level: 'Low',
      factors: ['Hypertension'],
    },
    customRisks: [],
  },
  healthGoals: [
    {
      id: '1',
      type: 'Steps',
      title: 'Daily Steps Goal',
      target: 10000,
      current: 7500,
      unit: 'steps',
      deadline: '2024-12-31',
      progress: 75,
      isCompleted: false,
    },
    {
      id: '2',
      type: 'Weight',
      title: 'Weight Loss Goal',
      target: 170,
      current: 175,
      unit: 'lbs',
      deadline: '2024-06-30',
      progress: 0,
      isCompleted: false,
    },
    {
      id: '3',
      type: 'Water',
      title: 'Daily Water Intake',
      target: 8,
      current: 6,
      unit: 'glasses',
      deadline: '2024-12-31',
      progress: 75,
      isCompleted: false,
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first health assessment',
      icon: 'award',
      unlockedAt: '2024-01-01',
      category: 'Milestone',
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Logged health data for 7 consecutive days',
      icon: 'target',
      unlockedAt: '2024-01-08',
      category: 'Consistency',
    },
  ],
  medicalRecords: [
    {
      id: '1',
      type: 'Report',
      title: 'Annual Physical Exam',
      date: '2024-01-01',
      description: 'Comprehensive health checkup with blood work',
      tags: ['Physical', 'Blood Work', 'Routine'],
    },
    {
      id: '2',
      type: 'Vaccination',
      title: 'COVID-19 Booster',
      date: '2023-10-15',
      description: 'Updated COVID-19 vaccination',
      tags: ['Vaccination', 'COVID-19'],
    },
  ],
  appSettings: {
    notifications: {
      appointments: true,
      medications: true,
      healthAlerts: true,
      goals: true,
      community: false,
    },
    language: 'English',
    accessibility: {
      fontSize: 'Medium',
      highContrast: false,
      voiceOver: false,
    },
    privacy: {
      shareData: false,
      anonymousAnalytics: true,
    },
  },
  isGuest: false,
  onboardingCompleted: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
});

export interface ProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  updatePersonalInfo: (info: Partial<UserProfile['personalInfo']>) => Promise<void>;
  updateHealthBasics: (basics: Partial<UserProfile['healthBasics']>) => Promise<void>;
  updateVitalsStats: (vitals: Partial<UserProfile['vitalsStats']>) => Promise<void>;
  addHealthGoal: (goal: Omit<HealthGoal, 'id'>) => Promise<void>;
  updateHealthGoal: (id: string, updates: Partial<HealthGoal>) => Promise<void>;
  deleteHealthGoal: (id: string) => Promise<void>;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  updateAppSettings: (settings: Partial<UserProfile['appSettings']>) => Promise<void>;
  calculateBMI: () => number;
  getRiskLevel: (riskType: 'heart' | 'diabetes' | 'kidney') => string;
}

export const [ProfileProvider, useProfile] = createContextHook((): ProfileContextType => {
  const [profile, setProfile] = useState<UserProfile>(createDefaultProfile());
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedProfile = JSON.parse(stored);
        setProfile(parsedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (updatedProfile: UserProfile) => {
    try {
      const profileToSave = {
        ...updatedProfile,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      setProfile(profileToSave);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updatePersonalInfo = useCallback(async (info: Partial<UserProfile['personalInfo']>) => {
    const updatedProfile = {
      ...profile,
      personalInfo: { ...profile.personalInfo, ...info },
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const updateHealthBasics = useCallback(async (basics: Partial<UserProfile['healthBasics']>) => {
    const updatedProfile = {
      ...profile,
      healthBasics: { ...profile.healthBasics, ...basics },
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const updateVitalsStats = useCallback(async (vitals: Partial<UserProfile['vitalsStats']>) => {
    const updatedProfile = {
      ...profile,
      vitalsStats: { ...profile.vitalsStats, ...vitals },
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const addHealthGoal = useCallback(async (goal: Omit<HealthGoal, 'id'>) => {
    const newGoal: HealthGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    const updatedProfile = {
      ...profile,
      healthGoals: [...profile.healthGoals, newGoal],
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const updateHealthGoal = useCallback(async (id: string, updates: Partial<HealthGoal>) => {
    const updatedGoals = profile.healthGoals.map(goal =>
      goal.id === id ? { ...goal, ...updates } : goal
    );
    const updatedProfile = {
      ...profile,
      healthGoals: updatedGoals,
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const deleteHealthGoal = useCallback(async (id: string) => {
    const updatedGoals = profile.healthGoals.filter(goal => goal.id !== id);
    const updatedProfile = {
      ...profile,
      healthGoals: updatedGoals,
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const addMedicalRecord = useCallback(async (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
    };
    const updatedProfile = {
      ...profile,
      medicalRecords: [...profile.medicalRecords, newRecord],
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const deleteMedicalRecord = useCallback(async (id: string) => {
    const updatedRecords = profile.medicalRecords.filter(record => record.id !== id);
    const updatedProfile = {
      ...profile,
      medicalRecords: updatedRecords,
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const updateAppSettings = useCallback(async (settings: Partial<UserProfile['appSettings']>) => {
    const updatedProfile = {
      ...profile,
      appSettings: { ...profile.appSettings, ...settings },
    };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const calculateBMI = useCallback(() => {
    const { height, weight } = profile.vitalsStats;
    const heightInInches = height.feet * 12 + height.inches;
    const heightInMeters = heightInInches * 0.0254;
    const weightInKg = weight * 0.453592;
    return Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;
  }, [profile.vitalsStats]);

  const getRiskLevel = useCallback((riskType: 'heart' | 'diabetes' | 'kidney') => {
    const riskMap = {
      heart: profile.riskTracker.heartRisk.level,
      diabetes: profile.riskTracker.diabetesRisk.level,
      kidney: profile.riskTracker.kidneyRisk.level,
    };
    return riskMap[riskType];
  }, [profile.riskTracker]);

  return useMemo(() => ({
    profile,
    isLoading,
    updatePersonalInfo,
    updateHealthBasics,
    updateVitalsStats,
    addHealthGoal,
    updateHealthGoal,
    deleteHealthGoal,
    addMedicalRecord,
    deleteMedicalRecord,
    updateAppSettings,
    calculateBMI,
    getRiskLevel,
  }), [
    profile,
    isLoading,
    updatePersonalInfo,
    updateHealthBasics,
    updateVitalsStats,
    addHealthGoal,
    updateHealthGoal,
    deleteHealthGoal,
    addMedicalRecord,
    deleteMedicalRecord,
    updateAppSettings,
    calculateBMI,
    getRiskLevel,
  ]);
});