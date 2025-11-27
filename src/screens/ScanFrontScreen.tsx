import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraViewRef } from 'expo-camera/build/Camera.types';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useCheckin } from '../context/CheckinContext';
import PrimaryButton from '../components/PrimaryButton';
import ChecklistItem from '../components/ChecklistItem';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanFront'>;

const ScanFrontScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewRef | null>(null);
  const [checklist, setChecklist] = useState([false, false, false]);
  const [isCapturing, setIsCapturing] = useState(false);
  const { setFrontImage } = useCheckin();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const allChecked = checklist.every(Boolean);

  const toggleItem = (index: number) => {
    setChecklist((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo?.uri) {
        setFrontImage(photo.uri);
        navigation.navigate('ScanFrontChecked');
      } else {
        Alert.alert('Error', 'No se pudo capturar la imagen. Inténtalo de nuevo.');
      }
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al capturar la imagen.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (permission.granted !== true) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>
          Necesitas otorgar permisos de cámara para continuar.
        </Text>
        <PrimaryButton label="Conceder permisos" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef} 
          style={styles.camera}
        />
      </View>
      <View style={styles.bottom}>
        <Text style={styles.title}>Escanea la parte delantera</Text>
        <ChecklistItem
          label="Documento dentro del marco"
          checked={checklist[0]}
        />
        <ChecklistItem label="Sin reflejos" checked={checklist[1]} />
        <ChecklistItem label="Texto legible" checked={checklist[2]} />
        <View style={styles.checklistToggles}>
          {checklist.map((_, index) => (
            <PrimaryButton
              key={index}
              label={`Marcar punto ${index + 1}`}
              onPress={() => toggleItem(index)}
            />
          ))}
        </View>
        <PrimaryButton
          label={isCapturing ? 'Capturando...' : 'Escanear parte delantera'}
          onPress={handleCapture}
          disabled={!allChecked || isCapturing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
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
  checklistToggles: {
    marginTop: 8,
  },
});

export default ScanFrontScreen;


