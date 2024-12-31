import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

type ScreenContainerProps = {
  children: React.ReactNode;
};

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
}) => {
  return (
    <>
      <LinearGradient
        colors={[COLORS.gradientFrom, COLORS.gradientTo]}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeAreaContainer}>{children}</SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
  },
});
