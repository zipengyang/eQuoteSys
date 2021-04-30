const functions = require('firebase-functions');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// reusable function for log activity, data should at least include : quoteid,and activity type props
const logActivity = async (data) => {
  const ref = admin.firestore().collection('specs');
  await ref
    .doc(data.quoteId)
    .get()
    .then((doc) => {
      const { leadtime, quantity, price, userId, status } = doc.data();
      const userRef = admin.firestore().collection('users');
      userRef
        .doc(userId)
        .collection('activityLog')
        .doc()
        .set({
          activity: data.activity,
          activityTitle: data.quoteId,
          content:
            'leadtime--' +
            leadtime +
            ' ,qty--' +
            quantity +
            ' ,price--' +
            price,
          // reference: doc.data(),
          date: admin.firestore.FieldValue.serverTimestamp(),
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

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
          unit_amount: data.amount * 100,
          product_data: {
            name: data.quoteId,
          },
        },
      },
    ],
  });
  return {
    id: session.id,
  };
});

// stripe webhook
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripe = require('stripe')(functions.config().stripe.secret);
  let event;

  try {
    const whSec = functions.config().stripe.payments_webhook_secret;

    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      whSec,
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.');
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });
    const quoteId = line_items.data[0].description;
    const data = { quoteId: quoteId, activity: 'paid' };
    // update payment status
    const ref = admin.firestore().collection('specs');
    await ref
      .doc(quoteId)
      .update({
        progress: 'paid',
      })
      .then(() => {
        //log activity
        logActivity(data);
      });
  }
  return res.sendStatus(200);
});

// log activity
exports.logCustomerActivity = functions.https.onCall(async (data) => {
  logActivity(data);
});

// update specs with offer and send email via sendGrid
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sendGridEmail = require('@sendgrid/mail');
sendGridEmail.setApiKey(SENDGRID_API_KEY);
exports.updateAndSendOfferEmail = functions.https.onCall((data) => {
  const ref = admin.firestore().collection('specs');
  const { camp, specs } = data;
  specs &&
    specs.map((item) => {
      ref
        .doc(item.id)
        .update({
          campaigns: {
            campaignId: camp.id,
            isClicked: false,
            isAccepted: false,
            offerDate: camp.startedDate,
            type: camp.type,
            offer: camp.offer,
            expiredDate: camp.expiredDate,
          },
        })
        .then(() => {
          const msg = {
            to: item.userId,
            from: 'crm@exceptionpcb.com',
            subject: 'Offer for your quote',
            templateId: 'd-399a0c1dd13047fbbb22a8bd65d38322',
            dynamic_template_data: {
              quoteId: item.id,
              offer: camp.offer,
              expired_date: camp.expiredDate,
            },
          };

          return sendGridEmail.send(msg);
        })
        .then(() => console.log('email sent'))
        .catch((error) => console.error(error));
    });
});

// email verification
// exports.emailVerification = functions.https.onCall(() => {
//   const email = 'zipeng.yang@exceptionpcb.com';
//   const actionCodeSettings = {
//     url: 'https://equotesys.vercel.app/',
//   };
//   admin
//     .auth()
//     .generatePasswordResetLink(email, actionCodeSettings)
//     .then(() => {
//       const msg = {
//         to: email,
//         from: 'crm@exceptionpcb.com',
//         subject: 'eQuoteSys Email Verification',
//         templateId: 'd-27b22b9caf4942ce9a81175bb7808cf9',
//         dynamic_template_data: {
//           url: 'https://equotesys.vercel.app/',
//         },
//       };
//       return sendGridEmail.send(msg);
//     })
//     .then(() => console.log('email sent'))
//     .catch((error) => console.error(error));
// });
