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

// because we don't have a database yet, I hardcoded some bathroom data to test the API routes.
// will be removed once we have a database we can pull from instead.

const bathrooms = require('./data/bathrooms.json')
const reviews = require('./data/reviews.json')

// get all bathrooms 
app.get('/api/bathrooms', async (req, res) => {
/*   res.json(bathrooms) */
  try {
    const snapshot = await db.collection('bathrooms').get()
    const bathrooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(bathrooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// get a specific bathroom based on id
app.get('/api/bathrooms/:id', async (req, res) => {
/*   const bathroom = bathrooms.find(b => b.id === Number(req.params.id))
  if (!bathroom) { 
    return res.status(404).json({ message: `Bathroom with id ${req.params.id} not found` })
  }
  res.json(bathroom) */
  try {
    const doc = await db.collection('bathrooms').doc(req.params.id).get()
    if (!doc.exists) {
      return res.status(404).json({ message: `Bathroom with id ${req.params.id} not found` })
    }
    res.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// get a specific bathroom's reviews based on id
app.get('/api/bathrooms/:id/reviews', async (req, res) => {
  const bathroomReviews = reviews.filter(r => r.bathroomId === Number(req.params.id))
  res.json(bathroomReviews)
/*   try {
    const snapshot = await db.collection('reviews')
        .where('bathroomId', '==', req.params.id)
        .get()
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  } */
})

// This is good practice for PUSHing info to server (such as a user liking a review)

// increment likes for a specific review (they have their own ids separate from bathroom id)
app.put('/api/reviews/:id/like', async (req, res) => { 
/*   const review = reviews.find(r => r.id === Number(req.params.id))
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  review.likes += 1 // so it actually updates the number of likes in the server data, not just on the frontend
  res.json(review) */
  try {
    const reviewRef = db.collection('reviews').doc(req.params.id)
    const review = await reviewRef.get()
    
    if (!review.exists) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    await reviewRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    })
    
    const updated = await reviewRef.get()
    res.json({ id: updated.id, ...updated.data() })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// increment dislikes for a review (same deal)
app.put('/api/reviews/:id/dislike', async (req, res) => {
/*   const review = reviews.find(r => r.id === Number(req.params.id))
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  review.dislikes += 1
  res.json(review) */
  try {
    const reviewRef = db.collection('reviews').doc(req.params.id)
    const review = await reviewRef.get()
    
    if (!review.exists) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    await reviewRef.update({
      dislikes: admin.firestore.FieldValue.increment(1)
    })
    
    const updated = await reviewRef.get()
    res.json({ id: updated.id, ...updated.data() })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// TODO: flesh these out!

// makes new bathroom profile
app.post('/api/bathrooms', async (req, res) => {
/*   res.json({ message: 'POST request - creates new bathroom', data: req.body })
 */
  try {
    const docRef = await db.collection('bathrooms').add(req.body)
    res.json({ message: 'Bathroom created', id: docRef.id, data: req.body })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// updates a bathroom's info
app.put('/api/bathrooms/:id', async (req, res) => {
/*   res.json({ message: `PUT request - updates bathroom ${req.params.id}`, data: req.body })
 */
  try {
    await db.collection('bathrooms').doc(req.params.id).update(req.body)
    res.json({ message: `Updated bathroom ${req.params.id}`, data: req.body })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// deletes a bathroom profile
app.delete('/api/bathrooms/:id', async (req, res) => {
/*   res.json({ message: `DELETE request - removes bathroom ${req.params.id}` })
 */
  try {
    await db.collection('bathrooms').doc(req.params.id).delete()
    res.json({ message: `Deleted bathroom ${req.params.id}` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// for hosting backened locally
const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// to connect local changes to vercel
module.exports = app;