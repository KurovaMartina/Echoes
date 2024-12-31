import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { COLORS } from '@/constants/colors';

type ControlButtonProps = {
  title: string;
  iconName: string;
  onPress: () => void;
};

export const ControlButton: React.FC<ControlButtonProps> = ({
  title,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => onPress()}>
      <Feather name={iconName} size={33} color={COLORS.white} />
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'semibold',
    justifyContent: 'center',
    padding: 16,
  },
  buttonTitle: {
    color: COLORS.white,
    paddingTop: 3,
  },
});
