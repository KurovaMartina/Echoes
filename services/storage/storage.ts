import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  ALL_TIME_HIGH_INDEX: 'ALL_TIME_HIGH_INDEX',
  LAST_QUESTION_INDEX: 'LAST_QUESTION_INDEX',
  LAST_QUESTION_DATE: 'LAST_QUESTION_DATE',
  OFFLINE_ANSWERS: 'OFFLINE_ANSWERS',
};

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error', 'Could not store data', error);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error', 'Could not read data', error);
  }
};
