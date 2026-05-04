const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')

let credential;
let authMethod = '';

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
    authMethod = 'Environment Variable (Service Account)';
    console.log('Using Firebase credentials from environment variable');
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
  }
} else {
  // login with either google cloud authentication or firebase service key
  // if using service key, save to a file named 'service-account-key.json' in backend

  /* 
  HI MARLA. To make the backend pull from firebase, it should work if you do 
  the following in terminal (i think...):
  gcloud auth login
  gcloud config set project cornell-bathroom
  gcloud auth application-default login

  ^ that is, if you want to log in with google. 
  you may need to download google cloud CLI first to run the above commands

  it should also work if you upload your own key to a local file. hopefully.

  Marla: TY!!!!!
  */ 
  try {
    credential = admin.credential.applicationDefault();
    authMethod = 'Cloud Auth (ADC)';
    console.log('Using Cloud Application Default Credentials');
  } catch (error) {
    console.log('Cloud Auth failed, defaulting to service account key');
    const serviceAccount = require('./service-account-key.json');
    credential = admin.credential.cert(serviceAccount);
    authMethod = 'Service Account Key';
  }
}

admin.initializeApp({
  credential,
  projectId: 'cornell-bathroom'
})


console.log(`Auth method: ${authMethod}`);

const db = admin.firestore() 
const app = express()
app.use(cors())
app.use(express.json())

// old, for handling weird data id name stuff (ignore)!!
const dataWithoutClientIds = (data) => {
  const { id, firebaseId, ...rest } = data
  return rest
}

const docWithFirebaseId = (doc) => ({
  firebaseId: doc.id,
  ...dataWithoutClientIds(doc.data())
})

const buildBathroomDescription = ({ gender, singleStall, hasShower, wheelchairAccessible }) => {
  const stallType = singleStall ? 'single stall' : 'multi stall'
  const showerText = hasShower ? 'does' : 'does not'
  const accessibleText = wheelchairAccessible ? 'is' : 'is not'

  return `This is a ${gender}, ${stallType} bathroom. It ${showerText} have a shower and ${accessibleText} wheelchair accessible.`
}

const updateBathroomAverageRating = async (bathroomId) => {
  const snapshot = await db.collection('reviews')
    .where('bathroomId', '==', bathroomId)
    .get()

  const ratings = snapshot.docs
    .map(doc => doc.data().rating)
    .filter(rating => typeof rating === 'number')

  const averageRating = ratings.length === 0
    ? 0
    : ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

  await db.collection('bathrooms').doc(bathroomId).update({ rating: averageRating })

  return averageRating
}

// testing api endpoint (for bathroom reviews) to see if backend works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!', timestamp: new Date().toISOString() });
});

// debug for backend receiving
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});


// get all bathrooms 
app.get('/api/bathrooms', async (req, res) => {
  try {
    const snapshot = await db.collection('bathrooms').get()
    const bathrooms = snapshot.docs.map(docWithFirebaseId)
    res.json(bathrooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// get a specific bathroom based on Firebase document ID
app.get('/api/bathrooms/:firebaseId', async (req, res) => {
  try {
    const doc = await db.collection('bathrooms').doc(req.params.firebaseId).get()
    if (!doc.exists) {
      return res.status(404).json({ message: `Bathroom with Firebase ID ${req.params.firebaseId} not found` })
    }
    res.json(docWithFirebaseId(doc))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// get a specific bathroom's reviews based on Firebase bathroom document ID
app.get('/api/bathrooms/:firebaseId/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews')
        .where('bathroomId', '==', req.params.firebaseId)
        .get()
      const reviews = snapshot.docs.map(docWithFirebaseId)
      res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// This is good practice for PUSHing info to server (such as a user liking a review)

// increment likes for a specific review (using the review's Firebase document ID)
app.put('/api/reviews/:firebaseId/like', async (req, res) => { 
  try {
    const reviewRef = db.collection('reviews').doc(req.params.firebaseId)
    const review = await reviewRef.get()
    
    if (!review.exists) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    await reviewRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    })
    
    const updated = await reviewRef.get()
    res.json(docWithFirebaseId(updated))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// increment dislikes for a review (same deal)
app.put('/api/reviews/:firebaseId/dislike', async (req, res) => {
  try {
    const reviewRef = db.collection('reviews').doc(req.params.firebaseId)
    const review = await reviewRef.get()
    
    if (!review.exists) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    await reviewRef.update({
      dislikes: admin.firestore.FieldValue.increment(1)
    })
    
    const updated = await reviewRef.get()
    res.json(docWithFirebaseId(updated))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// POSTs a new review, which is then added to the 'reviews' collection in Firebase. 
// The review data should include a reference to the bathroom's Firebase document ID (bathroomId) 
// so we know which bathroom the review is for.
app.post('/api/reviews', async (req, res) => {
  try {
    const data = dataWithoutClientIds(req.body)

    if (!data.bathroomId) {
      return res.status(400).json({ message: 'Review must reference an existing bathroom' })
    }

    if (typeof data.rating !== 'number') {
      return res.status(400).json({ message: 'Review rating must be a number' })
    }

    const bathroomRef = db.collection('bathrooms').doc(data.bathroomId)
    const bathroom = await bathroomRef.get()

    if (!bathroom.exists) {
      return res.status(400).json({ message: 'Review must reference an existing bathroom' })
    }

    const docRef = await db.collection('reviews').add(data)
    const bathroomRating = await updateBathroomAverageRating(data.bathroomId)
    const updatedBathroom = await bathroomRef.get()

    res.json({
      message: 'Review created',
      firebaseId: docRef.id,
      data,
      bathroomRating,
      bathroom: docWithFirebaseId(updatedBathroom)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// makes new bathroom profile
app.post('/api/bathrooms', async (req, res) => {
  try {
    const data = dataWithoutClientIds(req.body)
    data.description = buildBathroomDescription(data)
    data.rating = 0

    const docRef = await db.collection('bathrooms').add(data)
    res.json({ message: 'Bathroom created', firebaseId: docRef.id, data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// updates a bathroom's info
app.put('/api/bathrooms/:firebaseId', async (req, res) => {
  try {
    const data = dataWithoutClientIds(req.body)
    await db.collection('bathrooms').doc(req.params.firebaseId).update(data)
    res.json({ message: `Updated bathroom ${req.params.firebaseId}`, data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// deletes a bathroom profile
app.delete('/api/bathrooms/:firebaseId', async (req, res) => {
  try {
    await db.collection('bathrooms').doc(req.params.firebaseId).delete()
    res.json({ message: `Deleted bathroom ${req.params.firebaseId}` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// for hosting backened locally
/* const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
}) */
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// to connect local changes to vercel
module.exports = app;
