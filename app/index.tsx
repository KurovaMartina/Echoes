import React from 'react';
import 'react-native-reanimated';

import { Swiper } from '@/components/swiper/Swiper';
import { MainHeader } from '@/components/header/MainHeader';
import { ScreenContainer } from '@/components/UI/ScreenContainer';

export default function Home() {
  return (
    <ScreenContainer>
      <MainHeader />
      <Swiper />
    </ScreenContainer>
  );
}
