const functions = require('firebase-functions');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// create or update a new user profile after a user signup
exports.addUser = functions.https.onCall((data) => {
  const userRef = admin.firestore().collection('users');
  const doc = userRef.doc(data.email).get();
  if (!doc.exists) {
    userRef.doc(data.email).set({
      //   userId: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      email: data.email,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    userRef.doc(data.email).update({
      //   userId: user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
    });
  }
  // log activity
  userRef
    .doc(data.email)
    .collection('activityLog')
    .doc()
    .set({
      activity: 'Sign up',
      activityTitle: 'registration',
      content: data.firstName + ' ' + data.lastName + ' @ ' + data.companyName,
      date: admin.firestore.FieldValue.serverTimestamp(),
    });
});

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  const stripe = require('stripe')(functions.config().stripe.secret);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'http://localhost:3000/users/uid/selfService',
    cancel_url: 'http://localhost:3000/users/uid/selfService',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: data * 100,
          product_data: {
            name: 'PCB Prototype',
          },
        },
      },
    ],
  });
  return {
    id: session.id,
  };
});

// log activity
exports.logCustomerActivity = functions.https.onCall(
  async (quoteid, email, activity, context) => {
    const ref = admin.firestore().collection('specs');
    ref
      .doc(quoteid)
      .get()
      .then((doc) => {
        const { leadtime, quantity, price } = doc.data();

        const userRef = admin.firestore().collection('users');
        userRef
          .doc(email)
          .collection('activityLog')
          .doc()
          .set({
            activity: activity,
            activityTitle: quoteid,
            content:
              'leadtime--' +
              leadtime +
              ' ,qty--' +
              quantity +
              ' ,price--' +
              price,
            // reference: doc.data(),
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
      })
      .catch((err) => {
        console.error(err);
      });
    return console.log('activity loged');
  },
);
