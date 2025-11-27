import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  checked: boolean;
};

const ChecklistItem: React.FC<Props> = ({ label, checked }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : null]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 14,
    color: '#333333',
  },
});

export default ChecklistItem;


