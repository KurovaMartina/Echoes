import React, { useRef } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import 'react-native-reanimated';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addAnswer } from '@/services/firebase/firestore';
import { ScreenContainer } from '@/components/UI/ScreenContainer';
import { Header } from '@/components/header/Header';
import { COLORS } from '@/constants/colors';
import { ENGLISH_STRINGS } from '@/constants/strings';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { STORAGE_KEYS, storeData, getData } from '@/services/storage/storage';
import { Timestamp } from '@react-native-firebase/firestore';

const validationSchema = Yup.object().shape({
  text: Yup.string()
    .required(ENGLISH_STRINGS.textIsRequired)
    .max(1000, ENGLISH_STRINGS.textIsTooLong),
});

export default function Note() {
  const router = useRouter();
  const formikRef = useRef();
  const { questionId, questionTitle } = useLocalSearchParams();
  const [saveOffline, setSaveOffline] = React.useState(false);

  const submitFormOutside = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  const submitForm = async (values) => {
    const data = {
      questionId: questionId,
      text: values.text,
      created: Timestamp.fromDate(new Date()),
    };

    // Store to firebase
    try {
      await addAnswer(questionId, data);
    } catch (error) {
      Alert.alert('Error', 'Could not store data', error);
    }

    // Save to storage
    if (saveOffline) {
      try {
        await storeData(questionId, data);

        const offlineAnswers = await getData(STORAGE_KEYS.OFFLINE_ANSWERS);

        if (!offlineAnswers) {
          await storeData(STORAGE_KEYS.OFFLINE_ANSWERS, [questionId]);
        } else {
          if (!offlineAnswers.includes(questionId)) {
            const mergedIds = [...offlineAnswers, questionId];
            await storeData(STORAGE_KEYS.OFFLINE_ANSWERS, mergedIds);
          }
        }
      } catch (error) {
        console.error('Error', 'Could not store data offline', error);
      }
    }
    router.back();
  };

  return (
    <ScreenContainer>
      <View style={styles.customHeaderContainer}>
        <Header
          title={ENGLISH_STRINGS.addNote}
          left={
            <TouchableOpacity onPress={() => setSaveOffline(!saveOffline)}>
              <FontAwesome
                name={saveOffline ? 'bookmark' : 'bookmark-o'}
                size={25}
                color={COLORS.white}
              />
            </TouchableOpacity>
          }
          right={
            <TouchableOpacity onPress={() => submitFormOutside()}>
              <Text style={styles.headerRightButton}>
                {ENGLISH_STRINGS.done}
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
      <ScrollView style={styles.noteContent}>
        <View style={styles.questionTitleContainer}>
          <Text style={styles.questionTitle}>{questionTitle}</Text>
        </View>
        <Formik
          innerRef={formikRef}
          initialValues={{
            text: '',
            saveOffline: true,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log(values);
            await submitForm(values);
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <View>
              <TextInput
                multiline
                numberOfLines={1000}
                placeholder={ENGLISH_STRINGS.writeYourNoteHere}
                placeholderTextColor={COLORS.middleGray}
                value={values.text}
                onChangeText={handleChange('text')}
                onBlur={handleBlur('text')}
                style={styles.textArea}
                error={touched.text && !!errors.text}
              />
              {touched.text && errors.text && (
                <Text style={styles.errorText}>{errors.text}</Text>
              )}
            </View>
          )}
        </Formik>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  customHeaderContainer: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
    paddingLeft: 10,
    position: 'absolute',
    width: '100%',
  },
  errorText: {
    color: COLORS.darkRed,
    fontSize: 12,
  },
  headerRightButton: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  noteContent: {
    flex: 1,
    margin: 30,
  },
  questionTitle: {
    color: COLORS.white,
    fontFamily: 'NunitoBold',
    fontSize: 16,
  },
  questionTitleContainer: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 0.7,
    color: COLORS.white,
    paddingBottom: 10,
  },
  textArea: {
    backgroundColor: COLORS.transparent,
    color: COLORS.middleGray,
    marginBottom: 10,
    minHeight: '75%',
    paddingTop: 10,
  },
});
