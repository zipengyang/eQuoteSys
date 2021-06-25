// get all projects,todos,activities using react-query
import firebase from '../../firebase/firebase';
// import * as admin from 'firebase-admin';

const ref = firebase.firestore().collection('specs');
const userRef = firebase.firestore().collection('users');
const campRef = firebase.firestore().collection('campaigns');
const adminRef = firebase.firestore().collection('admin');
const taskRef = firebase.firestore().collection('tasks');
const emailRef = firebase.firestore().collection('emails');

// get specs to cache
export const getAllSpecs = async () => {
  const data = await ref.get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get specs by status
export const getSpecsByStatus = async ({ queryKey }) => {
  const [_key, status] = queryKey;
  const data = await ref.where('status', '==', status).get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get draft status and not yet promoted quotes
export const getDraftSpecs = async () => {
  const data = await ref.where('status', '==', 'draft').get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get promoted quotes
export const getPromotedSpecs = async () => {
  const data = await ref.where('status', '==', 'promoted').get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get opened promoted quotes
export const getOpenedPromotedSpecs = async () => {
  const data = await ref
    .where('status', '==', 'promoted')
    .where('campaigns.isClicked', '==', true)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get accepted promoted quotes
export const getAcceptedPromotedSpecs = async () => {
  const data = await ref
    .where('status', '==', 'promoted')
    .where('campaigns.isAccepted', '==', true)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get draft status quotes
export const getCustomerDraftSpecs = async ({ queryKey }) => {
  const [_key, email] = queryKey;

  const data = await ref
    .where('status', '==', 'draft')
    .where('userId', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get submitted status quotes
export const getAllSubmitted = async () => {
  const data = await ref.where('status', '==', 'submitted').get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get submitted status quotes
export const getCustomerSubmitted = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await ref
    .where('status', '==', 'submitted')
    .where('userId', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get quotes by email and status
export const getQuotesByEmailAndStatus = async ({ queryKey }) => {
  const [_key, email, status] = queryKey;
  const data = await ref
    .where('userId', '==', email)
    .where('status', '==', status)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get submitted status quotes
export const getCustomerAllQuotes = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await ref
    .where('status', '!=', 'initiated')
    .where('userId', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get assignedto  quotes
export const getAssignedToQuotes = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await ref
    .where('status', '==', 'submitted')
    .where('assignedTo', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get all users to cache
export const getAllUsers = async () => {
  const data = await userRef.get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get user's activity
export const getUserActivity = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await userRef.doc(email).collection('activityLog').get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get activity by quote ID
export const getActivityByQuoteId = async ({ queryKey }) => {
  const [_key, quoteId] = queryKey;
  const data = await firebase
    .firestore()
    .collection('activityLog')
    .where('quoteId', '==', quoteId)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

export const getAllActivity = async () => {
  const data = await firebase.forestore().collection('activityLog').get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get notification
// get activity by quote ID
export const getUserNotification = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await firebase
    .firestore()
    .collection('notification')
    .where('userId', '==', email)
    .get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get getAllCamps to cache
export const getAllCamps = async () => {
  const data = await campRef.get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};
// get a single item

export const getSpec = async ({ queryKey }) => {
  const [_key, { quoteid }] = queryKey;
  console.log('received id: ', quoteid);
  const data = await ref
    .doc(quoteid)
    .get()
    .then((result) => result.data());
  return data;
};
// get spec by id -- quoteId
export const getSpecById = async ({ queryKey }) => {
  const [_key, quoteId] = queryKey;

  const data = await ref
    .doc(quoteId)
    .get()
    .then((result) => result.data());
  return data;
};

// get signle user
export const getUser = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  console.log(email);
  const data = await userRef
    .doc(email)
    .get()
    .then((result) => result.data());
  return data;
};

// update
export const updateSpec = async ({ quoteid, ...data }) => {
  await ref
    .doc(quoteid)
    .update(data)
    .catch((err) => {
      console.error(err);
    });
};

// updateStatus
export const updateStatus = async ({ quoteId }) => {
  await ref
    .doc(quoteId)
    .update({
      status: 'draft',
    })
    .catch((err) => {
      console.error(err);
    });
};

// delete
export const deleteSpec = async (quoteid) => {
  await ref
    .doc(quoteid)
    .delete()
    .catch((err) => console.error(err));
};

// create data using uuid
export const createSpec = async ({ quoteid, ...data }) => {
  console.log(data);
  await ref
    .doc(quoteid)
    .set(data)
    .catch((err) => {
      console.error(err);
    });
};

// update spec with email and create a new user record if email does not exist.
export const updateSpecWithEmail = async ({ quoteid, ...data }) => {
  await ref
    .doc(quoteid)
    .update({ email: data.email })
    .then(async () => {
      // filter user data based on email address
      const res = await userRef.where('email', '==', data.email).get();
      const result = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      if (result.length === 0) {
        // no document found, create a new one here
        await userRef.doc().set({
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
          email: data.email,
          customerNumber: '',
          createdDate: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        return;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// get all admin
export const getAdmins = async () => {
  const data = await adminRef.get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get tasks related to customer
export const getTasks = async ({ queryKey }) => {
  const [_key, customerId] = queryKey;
  const data = await taskRef.where('customerId', '==', customerId).get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// get tasks related to assignedTo
export const getTasksByEmail = async ({ queryKey }) => {
  const [_key, email] = queryKey;
  const data = await taskRef.where('assignedTo', '==', email).get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

//get email by userID;

export const getEmailsByUserId = async ({ queryKey }) => {
  const [_key, userId] = queryKey;
  const data = await emailRef.where('sender', '==', userId).get();
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
};

// create activity log

// export const addActivityLog = async ( quoteId, userId, title ) =>
// {
//   console.log('quoteid:' ,quoteId)
//   firebase.firestore().collection('activityLog').doc().set({
//     userId: userId,
//     quoteId: quoteId,
//     title: title,
//     date: firebase.firestore.FieldValue.serverTimestamp(),
//   });
// };

// update spec with email and create a new user record if email does not exist.
// export const contactFormSubmit = async ({ quoteid, ...data }) => {
//   // email exist?
//   const res = await userRef.doc(data.email).get();
//   const result = () => res.data();

//   if (result.length === 0) {
//     // no document found, create a new one
//     await userRef.doc(data.email).set({
//       firstName: data.firstName,
//       lastName: data.lastName,
//       companyName: data.companyName,
//       email: data.email,
//       customerNumber: '',
//       createdDate: firebase.firestore.FieldValue.serverTimestamp(),
//     });
//   }
//   // upload file and update fields
//   const storageRef = firebase.storage().ref();
//   const fileRef = storageRef.child(
//     `/gerberFile/${quoteid}/` + data.gerberFile[0].name,
//   );
//   fileRef.put(data.gerberFile[0]).then(() => {
//     fileRef.getDownloadURL().then((url) => {
//       const ref = firebase.firestore().collection('specs');
//       ref
//         .doc(quoteid)
//         .update({
//           gerberFileUrl: url,
//           status: 'submitted',
//           userId: data.email,
//         })
//         .then(() => {
//           window.alert('submit successfully, we will contact you shortly');
//           window.location.href = '/';
//         });
//     });
//   });
// };

//   await ref
//     .doc(quoteid)
//     .update({ email: data.email })
//     .then(async () => {
//       // filter user data based on email address
//       const res = await userRef.where('email', '==', data.email).get();
//       const result = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//       if (result.length === 0) {
//         // no document found, create a new one here
//         await userRef.doc().set({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           companyName: data.companyName,
//           email: data.email,
//           customerNumber: '',
//           createdDate: firebase.firestore.FieldValue.serverTimestamp(),
//         });
//       } else {
//         return;
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
