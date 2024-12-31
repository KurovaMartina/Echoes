import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { questions } from '@/assets/data/questions';
import { StyleSheet, Text, View, Dimensions, Share } from 'react-native';
import 'react-native-reanimated';
import { getData, STORAGE_KEYS, storeData } from '@/services/storage/storage';
import { useRouter } from 'expo-router';
import { ENGLISH_STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/colors';
import { ControlButton } from '@/components/swiper/ControlButton';

export const Swiper = () => {
  const router = useRouter();
  const carouselRef = useRef(null);

  const { width, height } = Dimensions.get('window');

  const [lastQuestionIndex, setLastQuestionIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(width);
  const [screenHeight, setScreenHeight] = useState(height);
  const [isPortrait, setIsPortrait] = useState(true);

  const updateOrientation = () => {
    const { width, height } = Dimensions.get('window');
    setScreenWidth(width);
    setScreenHeight(height);
    setIsPortrait(height > width);
  };

  useEffect(() => {
    // Initialize orientation on mount
    updateOrientation();

    // Add event listener for orientation changes
    Dimensions.addEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    const fetchLastShownQuestion = async () => {
      const currentIndex = await getData(STORAGE_KEYS.LAST_QUESTION_INDEX);
      if (currentIndex !== null) {
        setLastQuestionIndex(parseInt(currentIndex));
      }
    };
    fetchLastShownQuestion();
  }, []);

  const saveCurrentQuestionIndex = async (index) => {
    setLastQuestionIndex(index);
    await storeData(STORAGE_KEYS.LAST_QUESTION_INDEX, index);
  };

  const handleSnap = async (newIndex) => {
    const lastQuestionIndex = questions.length - 1;
    if (newIndex < 0) {
      newIndex = lastQuestionIndex;
    }
    if (newIndex > lastQuestionIndex) {
      newIndex = 0;
    }
    await saveCurrentQuestionIndex(newIndex);
    carouselRef.current.scrollTo({ index: newIndex });
  };

  const shareQuestion = async () => {
    try {
      await Share.share({
        message: `${ENGLISH_STRINGS.shareMessage} ${questions[lastQuestionIndex]?.main}, ${questions[lastQuestionIndex]?.subtitle}`,
        title: ENGLISH_STRINGS.shareTitle, // iOS only
      });
    } catch (error) {
      console.error('Error sharing: ', error);
    }
  };

  return (
    <>
      <View style={styles.carouselContainer}>
        <Carousel
          style={styles.carousel}
          ref={carouselRef}
          width={screenWidth}
          height={isPortrait ? screenWidth : screenHeight}
          data={questions}
          renderItem={({ item }) => (
            <View style={styles.carouselContent}>
              <Text style={styles.mainText}>{item.main}</Text>
              <Text style={styles.subtitleText}>{item.subtitle}</Text>
              <ControlButton
                title={ENGLISH_STRINGS.addNote}
                iconName="edit"
                onPress={() => {
                  router.push({
                    pathname: '/note',
                    params: {
                      questionId: item.id,
                      questionTitle: item.main,
                      questionSubtitle: item.subtitle,
                    },
                  });
                }}
              />
            </View>
          )}
          onSnapToItem={saveCurrentQuestionIndex}
          defaultIndex={lastQuestionIndex}
        />
      </View>
      <View style={styles.controlButtonsContainer}>
        <ControlButton
          title={ENGLISH_STRINGS.prev}
          iconName={'chevron-left'}
          onPress={() => {
            handleSnap(carouselRef?.current?.getCurrentIndex() - 1);
          }}
        />
        <ControlButton
          title={ENGLISH_STRINGS.share}
          iconName={'share'}
          onPress={() => shareQuestion()}
        />
        <ControlButton
          title={ENGLISH_STRINGS.next}
          iconName={'chevron-right'}
          onPress={() => {
            handleSnap(carouselRef?.current?.getCurrentIndex() + 1);
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  carousel: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  carouselContainer: {
    alignItems: 'center',
    flex: 6,
    justifyContent: 'center',
    textAlign: 'center',
  },
  carouselContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  controlButtonsContainer: {
    alignItems: 'center',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  mainText: {
    color: COLORS.white,
    fontFamily: 'MontserratBold',
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitleText: {
    color: COLORS.white,
    fontFamily: 'MontserratRegular',
    fontSize: 16,
    lineHeight: 25,
    padding: 20,
    textAlign: 'center',
  },
});
