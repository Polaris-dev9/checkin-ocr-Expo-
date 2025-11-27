import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

type Props = {
  name: string;
  control: Control<any>;
  label: string;
} & TextInputProps;

const TextInputField: React.FC<Props> = ({ name, control, label, ...textInputProps }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ''}
            placeholderTextColor="#999999"
            {...textInputProps}
          />
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  error: {
    marginTop: 4,
    color: '#FF3B30',
    fontSize: 12,
  },
});

export default TextInputField;


