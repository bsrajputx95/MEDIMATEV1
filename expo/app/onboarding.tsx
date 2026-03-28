import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Heart,
  Ruler,
  Weight,
  Droplet,
  Activity,
  CheckCircle,
  Sparkles,
  Zap,
  Stethoscope,
  Brain,
  Wind,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingData {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  medicalConditions: string[];
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const MEDICAL_CONDITIONS = [
  { name: 'Diabetes', icon: Zap, color: '#f59e0b' },
  { name: 'Hypertension', icon: Heart, color: '#ef4444' },
  { name: 'Cancer', icon: Stethoscope, color: '#8b5cf6' },
  { name: 'Heart Disease', icon: Heart, color: '#ef4444' },
  { name: 'Epilepsy', icon: Brain, color: '#6366f1' },
  { name: 'Asthma', icon: Wind, color: '#06b6d4' },
] as const;

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    gender: 'Male',
    age: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    bloodGroup: 'A+',
    medicalConditions: [],
  });
  
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0 && currentStep > 1) {
        slideAnim.setValue(gestureState.dx / width);
      } else if (gestureState.dx < 0 && currentStep < 9) {
        slideAnim.setValue(gestureState.dx / width);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > width * 0.3) {
        if (gestureState.dx > 0 && currentStep > 1) {
          goToPreviousStep();
        } else if (gestureState.dx < 0 && currentStep < 9) {
          goToNextStep();
        }
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const goToNextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < 9) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const animateTransition = (callback: () => void) => {
    // Slide out to the right
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -1, // Slide out to left
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      // Reset position and slide in from right
      slideAnim.setValue(1); // Start from right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to center
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: currentStep / 9,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 2:
        if (!data.name.trim()) {
          Alert.alert('Required', 'Please enter your name');
          return false;
        }
        break;
      case 5:
        if (!data.age || parseInt(data.age) < 1 || parseInt(data.age) > 120) {
          Alert.alert('Invalid Age', 'Please enter a valid age (1-120)');
          return false;
        }
        break;
      case 6:
        if (!data.heightFeet || !data.heightInches) {
          Alert.alert('Required', 'Please enter your height');
          return false;
        }
        break;
      case 7:
        if (!data.weight || parseFloat(data.weight) < 1) {
          Alert.alert('Invalid Weight', 'Please enter a valid weight');
          return false;
        }
        break;
    }
    return true;
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding({
        name: data.name,
        gender: data.gender,
        age: parseInt(data.age),
        height: {
          feet: parseInt(data.heightFeet),
          inches: parseInt(data.heightInches),
        },
        weight: parseFloat(data.weight),
        bloodGroup: data.bloodGroup,
        medicalConditions: data.medicalConditions,
      });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  const toggleMedicalCondition = (condition: string) => {
    setData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter(c => c !== condition)
        : [...prev.medicalConditions, condition],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <User size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>Welcome to Medimate</Text>
            <Text style={styles.stepSubtitle}>
              Let&apos;s get to know you better to provide personalized medical insights
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color="#10b981" />
                <Text style={styles.featureText}>Personalized medical recommendations</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color="#10b981" />
                <Text style={styles.featureText}>AI-powered medical insights</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={20} color="#10b981" />
                <Text style={styles.featureText}>Secure and private data</Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <User size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your name?</Text>
            <Text style={styles.stepSubtitle}>Help us personalize your experience</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={data.name}
              onChangeText={(text) => setData(prev => ({ ...prev, name: text }))}
              autoFocus
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Sparkles size={48} color="#f59e0b" />
            </View>
            <Text style={styles.stepTitle}>Hi {data.name}! 👋</Text>
            <Text style={styles.stepSubtitle}>
              We&apos;ll ask you a few questions to personalize your health journey and provide the best recommendations for you.
            </Text>
            <View style={styles.welcomeCard}>
              <Heart size={32} color="#ef4444" fill="#ef4444" />
              <Text style={styles.welcomeCardText}>
                Your health data is secure and will only be used to improve your experience
              </Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <User size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your gender?</Text>
            <Text style={styles.stepSubtitle}>This helps us provide accurate health insights</Text>
            <View style={styles.optionsContainer}>
              {(['Male', 'Female', 'Other'] as const).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionButton,
                    data.gender === gender && styles.optionButtonSelected,
                  ]}
                  onPress={() => setData(prev => ({ ...prev, gender }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      data.gender === gender && styles.optionTextSelected,
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Activity size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your age?</Text>
            <Text style={styles.stepSubtitle}>Age helps us provide age-appropriate health advice</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your age"
              placeholderTextColor="#9ca3af"
              value={data.age}
              onChangeText={(text) => setData(prev => ({ ...prev, age: text.replace(/[^0-9]/g, '') }))}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
            />
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Ruler size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your height?</Text>
            <Text style={styles.stepSubtitle}>We&apos;ll use this for health calculations</Text>
            <View style={styles.heightContainer}>
              <View style={styles.heightInput}>
                <TextInput
                  style={styles.heightTextInput}
                  placeholder="5"
                  placeholderTextColor="#9ca3af"
                  value={data.heightFeet}
                  onChangeText={(text) => setData(prev => ({ ...prev, heightFeet: text.replace(/[^0-9]/g, '') }))}
                  keyboardType="numeric"
                  maxLength={1}
                />
                <Text style={styles.heightLabel}>ft</Text>
              </View>
              <View style={styles.heightInput}>
                <TextInput
                  style={styles.heightTextInput}
                  placeholder="8"
                  placeholderTextColor="#9ca3af"
                  value={data.heightInches}
                  onChangeText={(text) => setData(prev => ({ ...prev, heightInches: text.replace(/[^0-9]/g, '') }))}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.heightLabel}>in</Text>
              </View>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Weight size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your current weight?</Text>
            <Text style={styles.stepSubtitle}>This helps us calculate your BMI and health metrics</Text>
            <View style={styles.weightContainer}>
              <TextInput
                style={styles.weightInput}
                placeholder="70"
                placeholderTextColor="#9ca3af"
                value={data.weight}
                onChangeText={(text) => setData(prev => ({ ...prev, weight: text.replace(/[^0-9.]/g, '') }))}
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.weightLabel}>kg</Text>
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Droplet size={48} color="#ef4444" />
            </View>
            <Text style={styles.stepTitle}>What&apos;s your blood group?</Text>
            <Text style={styles.stepSubtitle}>Important for emergency situations and health tracking</Text>
            <View style={styles.bloodGroupContainer}>
              {BLOOD_GROUPS.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.bloodGroupButton,
                    data.bloodGroup === group && styles.bloodGroupButtonSelected,
                  ]}
                  onPress={() => setData(prev => ({ ...prev, bloodGroup: group }))}
                >
                  <Text
                    style={[
                      styles.bloodGroupText,
                      data.bloodGroup === group && styles.bloodGroupTextSelected,
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 9:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Activity size={48} color="#2563eb" />
            </View>
            <Text style={styles.stepTitle}>Any medical conditions?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply (optional but helpful)</Text>
            <ScrollView style={styles.conditionsContainer} showsVerticalScrollIndicator={false}>
              {MEDICAL_CONDITIONS.map((condition) => {
                const IconComponent = condition.icon;
                const isSelected = data.medicalConditions.includes(condition.name);
                return (
                  <TouchableOpacity
                    key={condition.name}
                    style={[
                      styles.conditionButton,
                      isSelected && styles.conditionButtonSelected,
                    ]}
                    onPress={() => toggleMedicalCondition(condition.name)}
                  >
                    <View style={styles.conditionContent}>
                      <View style={[
                        styles.conditionIconContainer,
                        { backgroundColor: isSelected ? '#ffffff' : condition.color + '20' }
                      ]}>
                        <IconComponent 
                          size={20} 
                          color={isSelected ? condition.color : condition.color} 
                        />
                      </View>
                      <Text
                        style={[
                          styles.conditionText,
                          isSelected && styles.conditionTextSelected,
                        ]}
                      >
                        {condition.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <CheckCircle size={20} color="#ffffff" />
                    )}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  styles.noneButton,
                  data.medicalConditions.length === 0 && styles.conditionButtonSelected,
                ]}
                onPress={() => setData(prev => ({ ...prev, medicalConditions: [] }))}
              >
                <Text
                  style={[
                    styles.conditionText,
                    data.medicalConditions.length === 0 && styles.conditionTextSelected,
                  ]}
                >
                  None of the above
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563eb', '#3b82f6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${(currentStep / 9) * 100}%`],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{currentStep} / 9</Text>
        </View>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-width, 0, width],
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <BlurView intensity={20} tint="light" style={styles.card}>
            {renderStep()}
          </BlurView>
        </Animated.View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={goToPreviousStep}>
              <ArrowLeft size={20} color="#ffffff" />
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.navSpacer} />
          
          <TouchableOpacity style={styles.navButtonPrimary} onPress={goToNextStep}>
            <Text style={styles.navButtonPrimaryText}>
              {currentStep === 9 ? 'Finish' : 'Next'}
            </Text>
            {currentStep < 9 && <ArrowRight size={20} color="#ffffff" />}
            {currentStep === 9 && <CheckCircle size={20} color="#ffffff" />}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginRight: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    width: '100%',
    textAlign: 'center',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  welcomeCardText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  optionsContainer: {
    alignSelf: 'stretch',
  },
  optionButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  heightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heightInput: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  heightTextInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    width: 80,
    textAlign: 'center',
    fontWeight: 'bold' as const,
  },
  heightLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500' as const,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    width: 120,
    textAlign: 'center',
    fontWeight: 'bold' as const,
  },
  weightLabel: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 12,
    fontWeight: '500' as const,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  bloodGroupButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    margin: 6,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 70,
  },
  bloodGroupButtonSelected: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  bloodGroupText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    fontWeight: 'bold' as const,
  },
  bloodGroupTextSelected: {
    color: '#ffffff',
  },
  conditionsContainer: {
    alignSelf: 'stretch',
    maxHeight: 300,
  },
  conditionButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  conditionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500' as const,
  },
  conditionTextSelected: {
    color: '#ffffff',
  },
  noneButton: {
    marginTop: 8,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  navSpacer: {
    flex: 1,
  },
  navButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navButtonPrimaryText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginRight: 8,
  },
  conditionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conditionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});