import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useCheckin } from '../context/CheckinContext';
import PrimaryButton from '../components/PrimaryButton';
import TextInputField from '../components/TextInputField';
import { personalSchema, PersonalFormValues } from '../forms/personalSchema';
import { t } from '../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalData'>;

const PersonalDataScreen: React.FC<Props> = ({ navigation }) => {
  const { personalData, updatePersonalData } = useCheckin();

  const { control, handleSubmit } = useForm<PersonalFormValues>({
    defaultValues: {
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      gender: personalData.gender ?? '',
      birthDate: personalData.birthDate ?? '',
      email: personalData.email ?? '',
    },
    resolver: zodResolver(personalSchema),
  });

  const onSubmit = (values: PersonalFormValues) => {
    updatePersonalData({
      ...values,
      gender: values.gender || undefined,
      birthDate: values.birthDate || undefined,
      email: values.email || undefined,
    });
    navigation.navigate('DocumentData');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{t('personalDataTitle')}</Text>
          <Text style={styles.subtitle}>
            Revisa y completa tus datos personales.
          </Text>

          <TextInputField
            name="firstName"
            control={control}
            label="Nombre"
            placeholder="Nombre"
          />
          <TextInputField
            name="lastName"
            control={control}
            label="Apellidos"
            placeholder="Apellidos"
          />
          <TextInputField
            name="gender"
            control={control}
            label="Género"
            placeholder="M/F/X"
          />
          <TextInputField
            name="birthDate"
            control={control}
            label="Fecha de nacimiento (YYYY-MM-DD)"
            placeholder="1990-01-31"
          />
          <TextInputField
            name="email"
            control={control}
            label="Email"
            keyboardType="email-address"
            placeholder="email@ejemplo.com"
            autoCapitalize="none"
          />

          <PrimaryButton
            label="Continuar a datos del documento"
            onPress={handleSubmit(onSubmit)}
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

export default PersonalDataScreen;


