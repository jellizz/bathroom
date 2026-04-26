/*
For deployment to Vercel.
this is lowk chatted tbh um.
*/

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let db;
try {
  // For production (Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'cornell-bathroom'
    });
    console.log('✅ Firebase initialized with service account (Vercel)');
  } else {
    // For local development with vercel dev
    const serviceAccount = require('../backend/service-account-key.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'cornell-bathroom'
    });
    console.log('✅ Firebase initialized with local key file');
  }
  db = admin.firestore();
} catch (error) {
  console.error('❌ Firebase init error:', error.message);
}

// Helper to convert Firestore timestamps
const convertTimestamps = (data) => {
  if (!data) return data;
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (result[key] && typeof result[key].toDate === 'function') {
      result[key] = result[key].toDate();
    }
  }
  return result;
};

// existing endpoints
app.get('/api/bathrooms', async (req, res) => {
  try {
    const snapshot = await db.collection('bathrooms').get();
    const bathrooms = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...convertTimestamps(doc.data()) 
    }));
    res.json(bathrooms);
  } catch (error) {
    console.error('Error fetching bathrooms:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/bathrooms/:id', async (req, res) => {
  try {
    const doc = await db.collection('bathrooms').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Bathroom not found' });
    }
    res.json({ id: doc.id, ...convertTimestamps(doc.data()) });
  } catch (error) {
    console.error('Error fetching bathroom:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/bathrooms/:id/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews')
      .where('bathroomId', '==', req.params.id)
      .get();
    const reviews = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...convertTimestamps(doc.data()) 
    }));
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bathrooms', async (req, res) => {
  try {
    const docRef = await db.collection('bathrooms').add(req.body);
    res.json({ message: 'Bathroom created', id: docRef.id });
  } catch (error) {
    console.error('Error creating bathroom:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/reviews/:id/like', async (req, res) => {
  try {
    const reviewRef = db.collection('reviews').doc(req.params.id);
    await reviewRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    });
    const updated = await reviewRef.get();
    res.json({ id: updated.id, ...convertTimestamps(updated.data()) });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/reviews/:id/dislike', async (req, res) => {
  try {
    const reviewRef = db.collection('reviews').doc(req.params.id);
    await reviewRef.update({
      dislikes: admin.firestore.FieldValue.increment(1)
    });
    const updated = await reviewRef.get();
    res.json({ id: updated.id, ...convertTimestamps(updated.data()) });
  } catch (error) {
    console.error('Error updating dislikes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Export for Vercel
module.exports = app;