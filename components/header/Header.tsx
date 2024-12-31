import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants/colors';

type HeaderProps = {
  left?: React.ReactNode;
  title?: string;
  titleStyle?: TextStyle;
  right?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({
  left,
  title,
  titleStyle,
  right,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>{left}</View>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 30,
    paddingTop: 10,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 6,
    justifyContent: 'center',
  },
  titleText: {
    color: COLORS.white,
    fontFamily: 'MontserratRegular',
    fontSize: 20,
    letterSpacing: 5,
    textAlignVertical: 'center',
  },
});
