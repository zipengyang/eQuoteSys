import { useQuery } from 'react-query';
import firebase from '../../firebase/firebase';
import { getCustomerSubmitted } from './getSpec';

const getSub = async (email) => {
  const ref = firebase.firestore().collection('specs');
  const data = await ref
    .where('status', '==', 'submitted')
    .where('userId', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};
export const SubmittedQuotes = (email) => {
  const { data, isLoading, isError } = useQuery('quotes', getSub(email));
  if (isLoading) return 'loading...';
  if (isError) return 'error...';
  return data;
};

export const DraftQuotes = [
  { id: 4, qty: 10, price: 1.25, leadtime: '10 days', status: 'draft' },
  { id: 5, qty: 10, price: 1.25, leadtime: '20 days', status: 'draft' },
  { id: 6, qty: 10, price: 1.25, leadtime: '15 days', status: 'draft' },
];
