import React from 'react';
import { useRouter } from 'next/router';
import { Paper } from '@material-ui/core';
import { useStyle } from '../../src/styles';
import { Button, Box, Typography } from '@material-ui/core';
import Link from 'next/link';
import ContactForm from './contactForm';
import firebase from '../../firebase/firebase';
import moment from 'moment';
import ConfirmDialog from '../shared/confirmDialog';

// this is for user without signup or login
export default function RequestForQuote() {
  const classes = useStyle();
  const router = useRouter();
  const { quoteid, step } = router.query;

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: '',
    entrance: '',
  });

  // if email exists, update spec with email and note, otherwise, create a new user leasing userId blank and update spec.

  const handleOnSubmit = async (data) => {
    const email = data.email.toLowerCase();
    console.log(email);
    const userRef = firebase.firestore().collection('users');
    const res = await userRef.doc(email).get();
    const result = () => res.data();

    if (result.length === 0) {
      // no document found, create a new one -- will use cloud function instead
      await userRef.doc(email).set({
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        email: email,
        customerNumber: '',
        createdDate: new Date().toISOString(),
      });
    }
    // upload file and update fields
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(
      `/gerberFile/${quoteid}/` + data.gerberFile[0].name,
    );
    fileRef.put(data.gerberFile[0]).then(() => {
      fileRef.getDownloadURL().then((url) => {
        const ref = firebase.firestore().collection('specs');
        ref
          .doc(quoteid)
          .update({
            gerberFileUrl: url,
            status: 'submitted',
            userId: email,
            submittedDate: new Date().toISOString(),
          })
          .then(() => {
            setConfirmDialog({
              isOpen: true,
              title: 'Thank you for submitting your request for quote.',
              subTitle:
                'We will check the gerber file and come back to you with offical quote shortly.',
              entrance: 'thankyou',
              onConfirm: () => {
                window.location.href = '/';
              },
            });
          })
          .then(() => {
            // log activity using cloud function
            const logActivity = firebase
              .functions()
              .httpsCallable('logCustomerActivity');
            logActivity(quoteid, email, 'submit');
          });
      });
    });
  };

  return (
    <>
      <ContactForm handleOnSubmit={handleOnSubmit} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
