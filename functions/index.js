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

// received quote email
exports.QuoteReceivedEmail = functions.https.onCall((email) => {
  const msg = {
    to: email,
    from: 'crm@exceptionpcb.com',
    subject: 'We have received your quote.',
    templateId: 'd-2dee1c1264b2480d8e300375fb7615ca',
    dynamic_template_data: {},
  };

  return sendGridEmail.send(msg);
});
// update quote email
exports.QuoteUpdatedEmail = functions.https.onCall((email) => {
  const msg = {
    to: email,
    from: 'crm@exceptionpcb.com',
    subject: 'We have an update on your quote.',
    templateId: 'd-d8a73528cec94a869469dd254f87ead5',
    dynamic_template_data: {},
  };

  return sendGridEmail.send(msg);
});

// price calculation
//factors
const factors = {
  panel: {
    1: { unitPrice: 100 },
    2: { unitPrice: 99.6 },
    3: { unitPrice: 99.2 },
    4: { unitPrice: 98.8 },
    5: { unitPrice: 98.4 },
    6: { unitPrice: 98.0 },
    7: { unitPrice: 97.6 },
    8: { unitPrice: 97.2 },
    9: { unitPrice: 96.8 },
    10: { unitPrice: 96.4 },
    11: { unitPrice: 96.0 },
    12: { unitPrice: 95.6 },
    13: { unitPrice: 95.2 },
    14: { unitPrice: 94.8 },
    15: { unitPrice: 94.4 },
    16: { unitPrice: 94.0 },
    17: { unitPrice: 93.6 },
    18: { unitPrice: 93.2 },
    19: { unitPrice: 92.8 },
    20: { unitPrice: 92.4 },
  },
  panelType: {
    1: { type: '18X24', Val: 0, width: 406, height: 560 },
    2: { type: '18x12', Val: 0, width: 406, height: 255 },
    3: { type: '21x24', Val: 5, width: 483, height: 560 },
    4: { type: '16x18', Val: 5, width: 368, height: 406 },
  },
  leadTime: {
    2: { type: '2 Days', Val: 3.0 },
    3: { type: '3 Days', Val: 2.25 },
    4: { type: '4 Days', Val: 1.8 },
    5: { type: '5 Days', Val: 1.5 },
    6: { type: '6 Days', Val: 1.4 },
    7: { type: '7 Days', Val: 1.25 },
    8: { type: '8 Days', Val: 1.15 },
    9: { type: '9 Days', Val: 1.05 },
    10: { type: '10 Days', Val: 1 },
    11: { type: '11 Days', Val: 0.98 },
    12: { type: '12 Days', Val: 0.96 },
    13: { type: '13 Days', Val: 0.94 },
    14: { type: '14 Days', Val: 0.92 },
    15: { type: '15 Days', Val: 0.9 },
    18: { type: '18 Days', Val: 0.84 },
    20: { type: '20 Days', Val: 0.8 },
    25: { type: '25 Days', Val: 0.78 },
    30: { type: '30 Days', Val: 0.76 },
  },
};

// step 1: panelization
const Calc_Array = (panType, w, h) => {
  panType = panType ? panType : 1; // default: '18x24

  const workAreaW = factors.panelType[panType].width;
  const workAreaL = factors.panelType[panType].height;
  let gap = 6;
  let p_w = workAreaW + gap;
  let p_h = workAreaL + gap;
  let numArray = 0;
  w = Number(w);
  h = Number(h);
  let i = 0;
  while (i <= 1) {
    let num = Math.floor(p_w / (w + gap)) * Math.floor(p_h / (h + gap));
    numArray += num;
    let r_w = p_w >= w ? p_w % (w + gap) : 0;
    let r_h = p_h >= h ? p_h % (h + gap) : 0;

    if (r_w < h && r_h < w) {
      break;
    }
    p_h = r_w >= h ? r_w : p_h;
    p_w = r_w >= h ? workAreaL + gap : p_w;

    p_w = r_h >= w ? r_h : p_w;
    p_h = r_h >= w ? workAreaW + gap : p_h;

    i += 1;
  }
  return numArray;
};

const GetPanel = (p, w, h) => {
  const num_1 = Calc_Array(p, w, h);
  const num_2 = Calc_Array(p, w, h);
  const best_cut = Math.max(num_1, num_2);
  return best_cut;
};

// panelization
const Panelization = (
  panelType,
  suppliedAs,
  width,
  height,
  ccPerArray,
  quantity,
) => {
  const bestCut = GetPanel(panelType, width, height);
  const calSteps = suppliedAs === 'single' ? bestCut : bestCut * ccPerArray;

  const panel =
    suppliedAs === 'single'
      ? Math.ceil(quantity / bestCut)
      : Math.ceil(quantity / (bestCut * ccPerArray));

  const unitPrice = panel > 20 ? 92.0 : factors.panel[panel].unitPrice;
  return { panel, calSteps, unitPrice };
};

//overmake
//others

// calculation

const Calculation = (data) => {
  let calArray = [];
  let totalPrice = 0;
  const panelType = 1; // set penal size as '18x24'
  const suppliedAs = data.suppliedAs.value === false ? 'single' : 'array';
  const panelization = Panelization(
    panelType,
    suppliedAs,
    data.width.value,
    data.height.value,
    data.ccPerArray.value,
    data.quantity.value,
  );
  const { calSteps, panel, unitPrice } = panelization;
  calArray.push({
    factor: 'step',
    value: calSteps,
    unitPrice: 0,
    amount: 0,
    totalPrice: 0,
  });
  calArray.push({
    factor: 'panel',
    value: panel,
    unitPrice,
    amount: panel * unitPrice,
    totalPrice: panel * unitPrice,
  });
  totalPrice = panel * unitPrice;
  // return calArray;
  // leadtime
  const pricePerCircuit = totalPrice / data.quantity.value;
  let prices = [];
  data.leadtime.value.map((item) =>
    prices.push({
      leadtime: item,
      price: pricePerCircuit * factors.leadTime[item].Val,
    }),
  );
  return prices;
};
// create or update a new user profile after a user signup
exports.addCalculation = functions.https.onCall(async (data) => {
  const result = await Calculation(data);
  if (result) {
    return result;
  } else return 0;
  // const ref = admin.firestore().collection('calculation');
  // ref
  //   .doc()
  //   .set({
  //     quoteId: data.quoteId,
  //     result,
  //   })
  //   .then(() => {
  //     admin
  //       .firestore()
  //       .collection('specs')
  //       .doc(data.quoteId)
  //       .update({ price: result[-1].totalPrice }); // tempoary
  //   })
  //   .catch((err) => console.error(err));
});
