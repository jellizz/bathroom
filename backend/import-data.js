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
  const bathroomIdMap = new Map()

  for (const [index, bathroom] of bathrooms.entries()) {
    const docRef = await db.collection('bathrooms').add(bathroom)
    bathroomIdMap.set(index + 1, docRef.id)
  }
  
  console.log('Importing reviews...')
  for (const review of reviews) {
    const { bathroomId, ...reviewData } = review
    const firebaseBathroomId = bathroomIdMap.get(bathroomId)

    if (!firebaseBathroomId) {
      throw new Error(`No imported bathroom found for review bathroomId ${bathroomId}`)
    }

    await db.collection('reviews').add({
      ...reviewData,
      bathroomId: firebaseBathroomId
    })
  }
  
  console.log('All data imported!')
}

importData()
