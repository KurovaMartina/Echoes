import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Header } from '@/components/header/Header';
import { NAVIGATION_ROUTES } from '@/constants/constants';
import { ENGLISH_STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/colors';

export const MainHeader = () => {
  const router = useRouter();

  return (
    <Header
      right={
        <TouchableOpacity
          onPress={() => {
            router.navigate(NAVIGATION_ROUTES.archive);
          }}
          style={styles.centeredView}
        >
          <Feather name="clock" size={30} color={COLORS.white} />
          <Text style={styles.buttonTitle}>{ENGLISH_STRINGS.archive}</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  buttonTitle: {
    color: COLORS.white,
    fontSize: 11,
    paddingTop: 5,
  },
  centeredView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
