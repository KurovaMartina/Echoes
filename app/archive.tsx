import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-reanimated';

import { Header } from '@/components/header/Header';
import { questions } from '@/assets/data/questions';
import { RESOURCE_TYPE } from '@/constants/constants';
import { ScreenContainer } from '@/components/UI/ScreenContainer';
import { COLORS } from '@/constants/colors';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { fetchAnswers } from '@/services/firebase/firestore';
import { getData, STORAGE_KEYS } from '@/services/storage/storage';
import { convertToDate } from '@/utils/dateConverter';
import { ENGLISH_STRINGS } from '@/constants/strings';
import { ResourceTitle } from '@/components/archive/ResourceTitle';

export default function Archive() {
  const router = useRouter();

  const [resourceType, setResourceType] = useState(RESOURCE_TYPE.ALL);
  const [answersRemote, setAnswersRemote] = useState([]);
  const [answersLocal, setAnswersLocal] = useState([]);
  const [answersFiltered, setAnswersFiltered] = useState([]);

  useEffect(() => {
    const setData = async () => {
      //  answers from remote
      const answersRemote = await fetchAnswers();
      setAnswersRemote(answersRemote);

      //  answers from local storage
      const stored = await getData(STORAGE_KEYS.OFFLINE_ANSWERS);
      const storedAnswers = [];
      stored.map((item) => {
        getData(item).then((ans) => {
          storedAnswers.push(ans);
        });
      });
      setAnswersLocal(storedAnswers);

      const mergedAnswers = [...answersRemote, ...storedAnswers];
      setAnswersFiltered(mergedAnswers);
    };

    setData();
  }, []);

  const switchResource = (resourceType) => {
    setResourceType(resourceType);
    switch (resourceType) {
      case RESOURCE_TYPE.LOCAL:
        setAnswersFiltered(answersLocal);
        break;
      case RESOURCE_TYPE.REMOTE:
        setAnswersFiltered(answersRemote);
        break;
      default:
        setAnswersFiltered([...answersRemote, ...answersLocal]);
    }
  };

  function createDate(answer) {
    if (!answer?.created) return { date: '', dayName: '' };
    const dateCreated = convertToDate(
      answer?.created?.seconds,
      answer?.created?.nanoseconds,
    );
    const date = dateCreated.toLocaleDateString();
    const dayName = dateCreated.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    return { date, dayName };
  }

  return (
    <ScreenContainer>
      <Header
        title={ENGLISH_STRINGS.archive}
        left={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={30} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      <View style={styles.resourcesContainer}>
        <ResourceTitle
          title={'All'}
          resourceType={RESOURCE_TYPE.ALL}
          currentResource={resourceType}
          onPress={() => {
            switchResource(RESOURCE_TYPE.ALL);
          }}
        />
        <Text style={styles.resourceTitle}>|</Text>
        <ResourceTitle
          title={'Remote'}
          resourceType={RESOURCE_TYPE.REMOTE}
          currentResource={resourceType}
          onPress={() => {
            switchResource(RESOURCE_TYPE.REMOTE);
          }}
        />
        <Text style={styles.resourceTitle}>|</Text>
        <ResourceTitle
          title={'Local'}
          resourceType={RESOURCE_TYPE.LOCAL}
          currentResource={resourceType}
          onPress={() => {
            switchResource(RESOURCE_TYPE.LOCAL);
          }}
        />
      </View>

      <ScrollView
        style={styles.archiveContainer}
        contentContainerStyle={styles.centeredView}
      >
        {answersFiltered.map((answer, index) => {
          const { dayName, date } = createDate(answer);
          return (
            <View key={index} style={styles.archiveItemContainer}>
              <Text style={styles.date}>
                {dayName}, {date}
              </Text>
              <Text style={styles.questionText}>
                {questions[answer.questionId].main}
              </Text>
              <View style={styles.separator}>
                <Text style={styles.answerText}>{answer.text}</Text>
              </View>

              {/*  ToDo add option to Edit, Delete */}
            </View>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  answerText: {
    color: COLORS.middleGray,
    fontFamily: 'Nunito',
    fontSize: 14,
    marginBottom: 10,
    padding: 5,
  },
  archiveContainer: {
    flex: 1,
    marginTop: 10,
  },
  archiveItemContainer: {
    backgroundColor: 'rgba(50, 50, 50, 0.1)',
    borderRadius: 5,
    borderWidth: 0,
    marginBottom: 7,
    minHeight: 50,
    padding: 7,
    width: '90%',
  },
  centeredView: {
    alignItems: 'center',
  },
  date: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 400,
    paddingLeft: 3,
  },
  questionText: {
    color: COLORS.white,
    fontFamily: 'NunitoBold',
    fontSize: 16,
    marginRight: 5,
    padding: 5,
  },
  resourceTitle: {
    color: COLORS.white,
    fontFamily: 'Nunito',
    padding: 5,
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginTop: 30,
  },
  separator: {
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 0.5,
  },
});
