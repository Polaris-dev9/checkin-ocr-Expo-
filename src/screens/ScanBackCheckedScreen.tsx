import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useCheckin } from '../context/CheckinContext';
import { analyzeIdCard } from '../services/mindeeClient';
import { mapMindeeToCheckinData } from '../services/ocrMapper';
import PrimaryButton from '../components/PrimaryButton';
import ChecklistItem from '../components/ChecklistItem';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanBackChecked'>;

const ScanBackCheckedScreen: React.FC<Props> = ({ navigation }) => {
  const { backImageUri, frontImageUri, setOcrData } = useCheckin();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!frontImageUri || !backImageUri) {
      Alert.alert('Faltan imágenes', 'Debes capturar frente y dorso del documento.');
      return;
    }

    try {
      setLoading(true);
      const { front, back } = await analyzeIdCard(frontImageUri, backImageUri);
      const { personalData, documentData } = mapMindeeToCheckinData(front, back);
      setOcrData(personalData, documentData);
    } catch (error: any) {
      Alert.alert(
        'Error OCR',
        'No se pudieron extraer los datos automáticamente. Puedes rellenarlos manualmente.'
      );
    } finally {
      setLoading(false);
      navigation.navigate('PersonalData');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewContainer}>
        {backImageUri ? (
          <Image source={{ uri: backImageUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.title}>Escanea la parte trasera</Text>
        <ChecklistItem label="Documento dentro del marco" checked={true} />
        <ChecklistItem label="Sin reflejos" checked={true} />
        <ChecklistItem label="Texto legible" checked={true} />

        <PrimaryButton
          label="Repetir foto"
          onPress={() => navigation.navigate('ScanBack')}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Extrayendo datos del documento...</Text>
          </View>
        ) : (
          <PrimaryButton
            label="Continuar"
            onPress={handleContinue}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  previewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  preview: {
    flex: 1,
  },
  previewPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
  },
  placeholderText: {
    color: '#8E8E93',
  },
  bottom: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default ScanBackCheckedScreen;


