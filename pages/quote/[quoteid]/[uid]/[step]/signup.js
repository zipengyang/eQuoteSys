import React from 'react';
import SignUpSide from '../../../../../components/stepForms/SignUpSide';
import firebase from '../../../../../firebase/firebase';
import 'firebase/auth';
import { useRouter } from 'next/router';
import Toast from '../../../../../components/shared/SnackBar';
import Link from 'next/link';

export default function registration() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const closeErrorToast = () => {
    setOpen(false);
  };
  const router = useRouter();
  const { quoteid, step, tabValue } = router.query;

  const handleFormSubmit = async (data) => {
    //create user
    await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        //call cloud function
        const addUser = firebase.functions().httpsCallable('addUser');
        addUser(data);
      })
      .then(() => {
        // update quote record
        if (quoteid !== 'quoteid') {
          const ref = firebase.firestore().collection('specs');
          ref.doc(quoteid).update({
            userId: data.email,
          });
        } else {
          console.log('there is no record to update.');
        }
      })
      .then(() => {
        const user = firebase.auth().currentUser;
        const url =
          quoteid === 'quoteid'
            ? `/users/${user.uid}/selfService`
            : `/quote/${quoteid}/${user.uid}/${step}?tabValue=${tabValue}`;

        router.push(url);
        // console.log(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div>
        <Link href="/">
          <a>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/pcb-online-quote-system.appspot.com/o/images%2FLogo.jpg?alt=media&token=b4dba3eb-a1c8-42ec-846b-c191f11b6746"
              width="100px"
            />
          </a>
        </Link>
      </div>
      <div>
        <SignUpSide
          handleFormSubmit={handleFormSubmit}
          quoteid={quoteid}
          step={step}
        />
      </div>
      <Toast open={open} message={message} closeErrorToast={closeErrorToast} />;
    </>
  );
}
