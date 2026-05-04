// imports the sample data to the Firestore database. Run with `node import-data.js` 
// from the backend directory. Make sure to set the FIREBASE_SERVICE_ACCOUNT environment 
// variable if you are not running this on a GCP instance with the appropriate permissions.

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
  const bathroomIds = new Map()

  console.log('Importing bathrooms...')
  for (const bathroom of bathrooms) {
    const { id, ...bathroomData } = bathroom
    const docRef = await db.collection('bathrooms').add(bathroomData) // randomly generated ids

    if (id !== undefined) {
      bathroomIds.set(id, docRef.id)
    }
  }
  
  console.log('Importing reviews...')
  for (const review of reviews) {
    const { id, bathroomId, ...reviewData } = review
    await db.collection('reviews').add({
      ...reviewData,
      bathroomId: bathroomIds.get(bathroomId) ?? bathroomId,
    })
  }
  
  console.log('All data imported!')
}

importData()
