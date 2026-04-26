const admin = require('firebase-admin')

let credential;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
} else {
  credential = admin.credential.applicationDefault();
}

admin.initializeApp({
  credential,
  projectId: 'cornell-bathroom'
})

const db = admin.firestore()
const bathrooms = require('./data/bathrooms.json')
const reviews = require('./data/reviews.json')

async function importData() {
  console.log('Importing bathrooms...')
  for (const bathroom of bathrooms) {
    await db.collection('bathrooms').add(bathroom) // need randomly generated ids
  }
  
  console.log('Importing reviews...')
  for (const review of reviews) {
    await db.collection('reviews').add(review)
  }
  
  console.log('All data imported!')
}

importData()