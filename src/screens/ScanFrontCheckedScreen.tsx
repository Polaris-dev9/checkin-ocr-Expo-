import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useCheckin } from '../context/CheckinContext';
import PrimaryButton from '../components/PrimaryButton';
import ChecklistItem from '../components/ChecklistItem';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanFrontChecked'>;

const ScanFrontCheckedScreen: React.FC<Props> = ({ navigation }) => {
  const { frontImageUri } = useCheckin();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewContainer}>
        {frontImageUri ? (
          <Image source={{ uri: frontImageUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.title}>Escanea la parte delantera</Text>
        <ChecklistItem label="Documento dentro del marco" checked={true} />
        <ChecklistItem label="Sin reflejos" checked={true} />
        <ChecklistItem label="Texto legible" checked={true} />

        <PrimaryButton
          label="Repetir foto"
          onPress={() => navigation.navigate('ScanFront')}
        />
        <PrimaryButton
          label="Continuar"
          onPress={() => navigation.navigate('ScanBack')}
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
});

export default ScanFrontCheckedScreen;


