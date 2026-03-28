import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  Upload,
  Type,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Utensils,
  Zap,
  Leaf,
  X,
} from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface FoodAnalysis {
  foodName: string;
  nutrition: NutritionInfo;
  healthScore: number;
  benefits: string[];
  concerns: string[];
  recommendations: string[];
}

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export default function FoodScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showMealTypeModal, setShowMealTypeModal] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  const mealTypes: { type: MealType; label: string; icon: string; time: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: '🌅', time: '6:00 - 10:00 AM' },
    { type: 'lunch', label: 'Lunch', icon: '☀️', time: '12:00 - 2:00 PM' },
    { type: 'snack', label: 'Snack', icon: '🍎', time: 'Anytime' },
    { type: 'dinner', label: 'Dinner', icon: '🌙', time: '6:00 - 9:00 PM' },
  ];

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          setShowCamera(false);
          console.log('📸 Photo captured:', photo.uri);
        }
      } catch (error) {
        console.error('❌ Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        console.log('🖼️ Image selected from gallery');
      }
    } catch (error) {
      console.error('❌ Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const analyzeFood = async () => {
    if (!capturedImage && !textDescription.trim()) {
      Alert.alert('Missing Information', 'Please provide either an image or description of the food.');
      return;
    }

    setIsAnalyzing(true);
    console.log('🔍 Starting food analysis with Perplexity API...');

    try {
      let requestBody: any = {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition expert with access to current nutritional databases. Analyze the food and provide detailed nutritional information in JSON format. 
            
            Return ONLY a valid JSON object with this exact structure:
            {
              "foodName": "string",
              "nutrition": {
                "calories": number,
                "protein": number,
                "carbs": number,
                "fat": number,
                "fiber": number,
                "sugar": number,
                "sodium": number
              },
              "healthScore": number (1-100),
              "benefits": ["string", "string"],
              "concerns": ["string", "string"],
              "recommendations": ["string", "string"]
            }
            
            Provide realistic nutritional values for a typical serving size. Health score should reflect overall nutritional value. Use current nutritional data and research.`
          }
        ]
      };

      if (capturedImage) {
        // For image analysis, convert image to base64 if needed
        let imageData = capturedImage;
        if (capturedImage.startsWith('file://')) {
          // Convert file URI to base64
          const response = await fetch(capturedImage);
          const blob = await response.blob();
          imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
        
        requestBody.messages.push({
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this food image for detailed nutritional content and provide health insights.' },
            { type: 'image_url', image_url: { url: imageData } }
          ]
        });
      } else {
        requestBody.messages.push({
          role: 'user',
          content: `Analyze this food description for detailed nutritional content: ${textDescription}`
        });
      }

      console.log('📡 Sending request to Perplexity API...');
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Perplexity API error:', response.status, errorText);
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 Perplexity Response:', data);
      
      const completion = data.choices?.[0]?.message?.content;
      if (!completion) {
        throw new Error('No completion received from Perplexity API');
      }
      
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = completion.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : completion;
        const analysisData = JSON.parse(jsonString);
        setAnalysisResult(analysisData);
        console.log('✅ Food analysis completed:', analysisData);
      } catch (parseError) {
        console.error('❌ Error parsing analysis result:', parseError);
        console.log('Raw completion:', completion);
        throw new Error('Failed to parse analysis result');
      }
    } catch (error) {
      console.error('❌ Error analyzing food:', error);
      Alert.alert('Analysis Failed', 'Unable to analyze the food. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveFoodEntry = () => {
    if (!selectedMealType || !analysisResult) return;
    
    console.log('💾 Saving food entry:', {
      mealType: selectedMealType,
      food: analysisResult.foodName,
      nutrition: analysisResult.nutrition,
      timestamp: new Date().toISOString(),
    });
    
    Alert.alert(
      'Food Saved!',
      `${analysisResult.foodName} has been added to your ${selectedMealType} log.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setTextDescription('');
    setAnalysisResult(null);
    setSelectedMealType(null);
    setShowMealTypeModal(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#6366f1" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan food items for nutritional analysis.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={() => setShowCamera(false)}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Food</Text>
              <TouchableOpacity
                style={styles.cameraFlipButton}
                onPress={() => setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'))}
              >
                <Camera size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraGuide}>
              <View style={styles.cameraFrame} />
              <Text style={styles.cameraGuideText}>Position food within the frame</Text>
            </View>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Food Scanner',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: '700', color: '#1e293b' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
              <ArrowLeft size={24} color="#6366f1" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {!analysisResult ? (
          <>
            {/* Input Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How would you like to add food?</Text>
              
              <View style={styles.inputOptionsContainer}>
                <TouchableOpacity 
                  style={styles.inputOption}
                  onPress={() => setShowCamera(true)}
                >
                  <View style={styles.inputOptionIcon}>
                    <Camera size={32} color="#6366f1" />
                  </View>
                  <Text style={styles.inputOptionTitle}>Take Photo</Text>
                  <Text style={styles.inputOptionSubtitle}>Capture food with camera</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.inputOption}
                  onPress={pickImage}
                >
                  <View style={styles.inputOptionIcon}>
                    <Upload size={32} color="#6366f1" />
                  </View>
                  <Text style={styles.inputOptionTitle}>Upload Image</Text>
                  <Text style={styles.inputOptionSubtitle}>Select from gallery</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.textInputContainer}>
                <View style={styles.textInputHeader}>
                  <Type size={20} color="#6366f1" />
                  <Text style={styles.textInputTitle}>Describe Your Food</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Grilled chicken breast with steamed broccoli and brown rice"
                  placeholderTextColor="#94a3b8"
                  value={textDescription}
                  onChangeText={setTextDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            {/* Preview */}
            {capturedImage && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Food Image</Text>
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setCapturedImage(null)}
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {/* Analyze Button */}
            {(capturedImage || textDescription.trim()) && (
              <View style={styles.section}>
                <TouchableOpacity 
                  style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                  onPress={analyzeFood}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                    </>
                  ) : (
                    <>
                      <Zap size={20} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.analyzeButtonText}>Analyze Food</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <View style={styles.section}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{analysisResult.foodName}</Text>
                <View style={styles.healthScoreBadge}>
                  <Text style={styles.healthScoreText}>{analysisResult.healthScore}/100</Text>
                </View>
              </View>
              
              {capturedImage && (
                <Image source={{ uri: capturedImage }} style={styles.resultImage} />
              )}
            </View>
            
            {/* Nutrition Facts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              <View style={styles.nutritionCard}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.calories} kcal</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.protein}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Carbohydrates</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.carbs}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.fat}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Fiber</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.fiber}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Sugar</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.sugar}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Sodium</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.nutrition.sodium}mg</Text>
                </View>
              </View>
            </View>
            
            {/* Health Benefits */}
            {analysisResult.benefits.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health Benefits</Text>
                <View style={styles.benefitsCard}>
                  {analysisResult.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <CheckCircle size={16} color="#10b981" />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Health Concerns */}
            {analysisResult.concerns.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health Considerations</Text>
                <View style={styles.concernsCard}>
                  {analysisResult.concerns.map((concern, index) => (
                    <View key={index} style={styles.concernItem}>
                      <AlertTriangle size={16} color="#f59e0b" />
                      <Text style={styles.concernText}>{concern}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                <View style={styles.recommendationsCard}>
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Leaf size={16} color="#6366f1" />
                      <Text style={styles.recommendationText}>{recommendation}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Action Buttons */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.addToMealButton}
                onPress={() => setShowMealTypeModal(true)}
              >
                <Utensils size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.addToMealButtonText}>Add to Meal Log</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.scanAnotherButton}
                onPress={resetScanner}
              >
                <Text style={styles.scanAnotherButtonText}>Scan Another Food</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Meal Type Selection Modal */}
      <Modal
        visible={showMealTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMealTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Meal Type</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowMealTypeModal(false)}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mealTypeOptions}>
              {mealTypes.map((meal) => (
                <TouchableOpacity
                  key={meal.type}
                  style={[
                    styles.mealTypeOption,
                    selectedMealType === meal.type && styles.mealTypeOptionSelected
                  ]}
                  onPress={() => setSelectedMealType(meal.type)}
                >
                  <View style={styles.mealTypeInfo}>
                    <Text style={styles.mealTypeEmoji}>{meal.icon}</Text>
                    <View style={styles.mealTypeDetails}>
                      <Text style={styles.mealTypeLabel}>{meal.label}</Text>
                      <Text style={styles.mealTypeTime}>{meal.time}</Text>
                    </View>
                  </View>
                  {selectedMealType === meal.type && (
                    <CheckCircle size={20} color="#6366f1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.confirmMealButton,
                !selectedMealType && styles.confirmMealButtonDisabled
              ]}
              onPress={saveFoodEntry}
              disabled={!selectedMealType}
            >
              <Text style={styles.confirmMealButtonText}>Add to {selectedMealType || 'Meal'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1e293b',
    textAlign: 'center' as const,
  },
  permissionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  headerBackButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 16,
  },
  inputOptionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  inputOption: {
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
  inputOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputOptionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  inputOptionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
    paddingHorizontal: 16,
  },
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  textInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  textInputTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  textInput: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1e293b',
    flex: 1,
  },
  healthScoreBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthScoreText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10b981',
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  nutritionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  nutritionValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600' as const,
  },
  benefitsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  concernsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  concernText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#581c87',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  addToMealButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToMealButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  scanAnotherButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  scanAnotherButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  bottomPadding: {
    height: 40,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  cameraBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  cameraFlipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cameraFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  cameraGuideText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraControls: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  modalCloseButton: {
    padding: 4,
  },
  mealTypeOptions: {
    gap: 12,
    marginBottom: 24,
  },
  mealTypeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealTypeOptionSelected: {
    backgroundColor: '#ede9fe',
    borderColor: '#6366f1',
  },
  mealTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealTypeEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  mealTypeDetails: {
    flex: 1,
  },
  mealTypeLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  mealTypeTime: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  confirmMealButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmMealButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  confirmMealButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
});