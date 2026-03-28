import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Info,
  Heart,
  User,
  Circle,
  Wind,
  Eye,
  Brain,
  Plus,
  X,
  Leaf,
  Activity,
  Send,
  Camera,
  MessageCircle,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useAssistant } from '@/contexts/AssistantContext';
import { BodyPart, AnalysisResult } from '@/types/healthyics';
import { defaultBodyParts, commonNutrientSuggestions, commonLifestyleSuggestions } from '@/constants/healthyics';

const { width } = Dimensions.get('window');

interface BodyPartButtonProps {
  bodyPart: BodyPart;
  onPress: () => void;
}

const BodyPartButton: React.FC<BodyPartButtonProps> = ({ bodyPart, onPress }) => {
  const getIcon = (iconName: string) => {
    const iconProps = { size: 32, color: bodyPart.color };
    switch (iconName) {
      case 'heart': return <Heart {...iconProps} />;
      case 'kidney': return <Circle {...iconProps} />;
      case 'bone': return <Circle {...iconProps} />;
      case 'user': return <User {...iconProps} />;
      case 'circle': return <Circle {...iconProps} />;
      case 'wind': return <Wind {...iconProps} />;
      case 'eye': return <Eye {...iconProps} />;
      case 'brain': return <Brain {...iconProps} />;
      default: return <Circle {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity style={styles.bodyPartButton} onPress={onPress}>
      <View style={[styles.bodyPartIcon, { backgroundColor: bodyPart.color + '20' }]}>
        {getIcon(bodyPart.icon)}
      </View>
      <Text style={styles.bodyPartLabel}>{bodyPart.name}</Text>
    </TouchableOpacity>
  );
};

const AddPartButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.bodyPartButton} onPress={onPress}>
      <View style={[styles.bodyPartIcon, { backgroundColor: '#6366f120' }]}>
        <Plus size={32} color="#6366f1" />
      </View>
      <Text style={styles.bodyPartLabel}>Add Part</Text>
    </TouchableOpacity>
  );
};

export default function HealthyicsScreen() {
  const { setCurrentScreen } = useAssistant();
  const [bodyParts, setBodyParts] = useState<BodyPart[]>(defaultBodyParts);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showAddPartModal, setShowAddPartModal] = useState<boolean>(false);
  const [newPartName, setNewPartName] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('healthyics');
      console.log('📱 Screen changed to: Healthyics');
    }, [setCurrentScreen])
  );

  const handleBodyPartPress = (bodyPart: BodyPart) => {
    console.log('🔍 Selected body part:', bodyPart.name);
    setSelectedBodyPart(bodyPart);
    setIssueDescription('');
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!issueDescription.trim() || !selectedBodyPart) {
      Alert.alert('Missing Information', 'Please describe the issue you are experiencing.');
      return;
    }

    console.log('🔬 Analyzing issue:', issueDescription);
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock suggestions based on the issue
      const mockResult: AnalysisResult = {
        nutrients: commonNutrientSuggestions.slice(0, 3),
        lifestyle: commonLifestyleSuggestions.slice(0, 3)
      };
      
      setAnalysisResult(mockResult);
      console.log('✅ Analysis complete');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      Alert.alert('Analysis Failed', 'Unable to analyze your issue. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddNewPart = () => {
    if (!newPartName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the body part.');
      return;
    }

    const newPart: BodyPart = {
      id: Date.now().toString(),
      name: newPartName,
      icon: 'circle',
      color: '#6366f1',
      exampleIssue: 'custom issue'
    };

    setBodyParts(prev => [...prev, newPart]);
    setNewPartName('');
    setShowAddPartModal(false);
    console.log('➕ Added new body part:', newPartName);
  };

  const handleBack = () => {
    if (analysisResult) {
      setAnalysisResult(null);
    } else if (selectedBodyPart) {
      setSelectedBodyPart(null);
      setIssueDescription('');
    }
  };

  const renderMainScreen = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Healthyics</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Info size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Parts Grid */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Health Tools</Text>
          
          {/* Quick Access Tools */}
          <View style={styles.toolsContainer}>
            <TouchableOpacity 
              style={styles.toolButton}
              onPress={() => router.push('/food-scanner')}
            >
              <View style={styles.toolIcon}>
                <Camera size={24} color="#6366f1" />
              </View>
              <Text style={styles.toolTitle}>Food Scanner</Text>
              <Text style={styles.toolSubtitle}>Analyze nutrition & health impact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolButton}
              onPress={() => router.push('/health-buddy')}
            >
              <View style={styles.toolIcon}>
                <MessageCircle size={24} color="#10b981" />
              </View>
              <Text style={styles.toolTitle}>Health Buddy</Text>
              <Text style={styles.toolSubtitle}>Chat with AI health assistant</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Select Body Part or Health Area</Text>
          <View style={styles.bodyPartsGrid}>
            {bodyParts.map((bodyPart) => (
              <BodyPartButton
                key={bodyPart.id}
                bodyPart={bodyPart}
                onPress={() => handleBodyPartPress(bodyPart)}
              />
            ))}
            <AddPartButton onPress={() => setShowAddPartModal(true)} />
          </View>
        </View>
      </ScrollView>
    </>
  );

  const renderIssueScreen = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBodyPart?.name} Issue</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.issueContainer}>
          <Text style={styles.sectionTitle}>Describe Your Issue</Text>
          <Text style={styles.exampleText}>
            Example: &ldquo;{selectedBodyPart?.exampleIssue}&rdquo;
          </Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Describe the issue you are having..."
            placeholderTextColor="#94a3b8"
            value={issueDescription}
            onChangeText={setIssueDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send size={20} color="#ffffff" />
            )}
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );

  const renderAnalysisScreen = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Suggestions</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.analysisContainer}>
          {/* Nutrient Suggestions */}
          <View style={styles.suggestionSection}>
            <View style={styles.suggestionHeader}>
              <Leaf size={20} color="#10b981" />
              <Text style={styles.suggestionTitle}>Nutrient Deficiency Suggestions</Text>
            </View>
            {analysisResult?.nutrients.map((nutrient: any) => (
              <View key={nutrient.id} style={styles.suggestionCard}>
                <View style={styles.suggestionIcon}>
                  <Leaf size={16} color="#10b981" />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName}>{nutrient.name}</Text>
                  <Text style={styles.suggestionDescription}>{nutrient.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Lifestyle Suggestions */}
          <View style={styles.suggestionSection}>
            <View style={styles.suggestionHeader}>
              <Activity size={20} color="#6366f1" />
              <Text style={styles.suggestionTitle}>Daily Life Adjustments</Text>
            </View>
            {analysisResult?.lifestyle.map((lifestyle: any) => (
              <View key={lifestyle.id} style={styles.suggestionCard}>
                <View style={styles.suggestionIcon}>
                  <Activity size={16} color="#6366f1" />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName}>{lifestyle.title}</Text>
                  <Text style={styles.suggestionDescription}>{lifestyle.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      {analysisResult ? renderAnalysisScreen() : selectedBodyPart ? renderIssueScreen() : renderMainScreen()}

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInfoModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Healthyics</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Healthyics helps you understand potential nutrient deficiencies and lifestyle adjustments based on health issues you&apos;re experiencing. Select a body part, describe your symptoms, and get personalized suggestions for better health.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Part Modal */}
      <Modal
        visible={showAddPartModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddPartModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddPartModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Body Part</Text>
              <TouchableOpacity onPress={() => setShowAddPartModal(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter body part name..."
              placeholderTextColor="#94a3b8"
              value={newPartName}
              onChangeText={setNewPartName}
              autoFocus
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddNewPart}>
              <Text style={styles.modalButtonText}>Add Part</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1e293b',
    textAlign: 'center' as const,
    flex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    padding: 24,
  },
  toolsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  toolButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  toolSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  bodyPartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  bodyPartButton: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  bodyPartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bodyPartLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#1e293b',
    textAlign: 'center' as const,
  },
  issueContainer: {
    padding: 24,
  },
  exampleText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic' as const,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  analyzeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  analysisContainer: {
    padding: 24,
  },
  suggestionSection: {
    marginBottom: 32,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
});