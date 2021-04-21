import React from 'react';
import Link from 'next/link';
import firebase from '../../../../../firebase/firebase';
import 'firebase/auth';
import { useRouter } from 'next/router';
import Toast from '../../../../../components/shared/SnackBar';
import SignInSide from '../../../../../components/stepForms/SignInSide';

export default function login() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const closeErrorToast = () => {
    setOpen(false);
  };
  // when the user start the login ? redirect to different route based on:
  //   1. whether before start a new quote
  //   2. whether in the middle of a quote

  const router = useRouter();
  const { quoteid, step, tabValue } = router.query;

  const handleFormSubmit = async (data) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(async (firebaseUser) => {
        const user = firebase.auth().currentUser;

        //if admin
        if (step && step == 'admin') {
          router.push(`/users/${user.uid}/admin`);
        } else {
          // if quote does not exists:

          if (quoteid && quoteid === 'quoteid') {
            // log activity
            const userRef = firebase.firestore().collection('users');
            userRef
              .doc(user.email)
              .collection('activityLog')
              .doc()
              .set({
                activity: 'Log in',
                activityTitle: 'login to self-service portal',
                content: '',
                date: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                router.push(`/users/${user.uid}/selfService`);
              });
          } else {
            // if quote exists, update userId
            const url =
              step && step === '9' // save for later
                ? `/users/${user.uid}/selfService`
                : step && step === '2' // submit for quote
                ? `/quote/${quoteid}/${user.uid}/3/`
                : `/quote/${quoteid}/${user.uid}/${step}?tabValue=${tabValue}`;

            const ref = firebase.firestore().collection('specs');
            await ref
              .doc(quoteid)
              .update({
                userId: user.email,
                status: step === '9' ? 'draft' : status,
              })
              .then(() => {
                // log activity using cloud function
                const data = { quoteId: quoteid, activity: 'save quote' };
                const logActivity = firebase
                  .functions()
                  .httpsCallable('logCustomerActivity');
                logActivity(data);
              })
              .then(() => router.push(url))
              .catch((err) => {
                console.error(err);
              });
          }
        }
      })
      .catch(function (error) {
        const message = error.message;
        setOpen(true);
        setMessage(message);
      });
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
        {/* <SignIn handleFormSubmit={handleFormSubmit} /> */}
        <SignInSide
          handleFormSubmit={handleFormSubmit}
          quoteid={quoteid}
          step={step}
          tabValue={tabValue}
        />
      </div>
      <Toast open={open} message={message} closeErrorToast={closeErrorToast} />;
    </>
  );
}
