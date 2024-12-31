import firestore from '@react-native-firebase/firestore';

const answersCollectionRef = firestore().collection('answers');

export const fetchAnswers = async () => {
  try {
    const res = await answersCollectionRef.get();
    return res?.docs?.map((doc) => ({ ...doc?.data(), id: doc?.id }));
  } catch (error) {
    console.error('Error fetching answers:', error);
    return error;
  }
};

export const addAnswer = async (docId, data) => {
  if (!data) return;
  try {
    await answersCollectionRef.doc(docId).set(data);
    return true;
  } catch (error) {
    console.error('Error adding answer:', error);
    throw error;
  }
};
