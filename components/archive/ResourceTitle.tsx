import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import React from 'react';

export const ResourceTitle = ({
  title,
  resourceType,
  currentResource,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
    >
      <Text
        style={[
          styles.filterButton,
          resourceType === currentResource && {
            color: COLORS.middleGray,
            textDecorationLine: 'underline',
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    color: COLORS.white,
    fontFamily: 'Nunito',
    padding: 5,
  },
});
