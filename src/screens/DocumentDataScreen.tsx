import React from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckin } from '../context/CheckinContext';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { documentSchema, DocumentFormValues } from '../forms/documentSchema';
import { t } from '../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentData'>;

const DocumentDataScreen: React.FC<Props> = () => {
  const { documentData, updateDocumentData } = useCheckin();

  const { control, handleSubmit } = useForm<DocumentFormValues>({
    defaultValues: {
      nationality: documentData.nationality ?? '',
      documentType: documentData.documentType,
      documentNumber: documentData.documentNumber,
      supportNumber: documentData.supportNumber ?? '',
      issueDate: documentData.issueDate ?? '',
      expiryDate: documentData.expiryDate ?? '',
    },
    resolver: zodResolver(documentSchema),
  });

  const handleFinish = (values: DocumentFormValues) => {
    updateDocumentData({
      ...values,
      nationality: values.nationality || undefined,
      supportNumber: values.supportNumber || undefined,
      issueDate: values.issueDate || undefined,
      expiryDate: values.expiryDate || undefined,
    });
    Alert.alert('Check-in', 'Flujo de ejemplo completado.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{t('documentDataTitle')}</Text>
          <Text style={styles.subtitle}>
            Revisa y completa los datos de tu documento de identidad.
          </Text>

          <TextInputField
            name="nationality"
            control={control}
            label="Nacionalidad (ej. ES 🇪🇸)"
            placeholder="ES"
            autoCapitalize="characters"
          />
          <TextInputField
            name="documentType"
            control={control}
            label="Tipo de documento"
            placeholder="DNI, Pasaporte..."
          />
          <TextInputField
            name="documentNumber"
            control={control}
            label="Número de documento"
            placeholder="12345678X"
          />
          <TextInputField
            name="supportNumber"
            control={control}
            label="Número de soporte"
            placeholder="Opcional"
          />
          <TextInputField
            name="issueDate"
            control={control}
            label="Fecha de emisión (YYYY-MM-DD)"
            placeholder="2020-01-01"
          />
          <TextInputField
            name="expiryDate"
            control={control}
            label="Fecha de caducidad (YYYY-MM-DD)"
            placeholder="2030-01-01"
          />

          <PrimaryButton
            label={t('finish')}
            onPress={handleSubmit(handleFinish)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 24,
  },
});

export default DocumentDataScreen;


