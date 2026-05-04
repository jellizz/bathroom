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

  for (const bathroom of bathrooms) {
    const { id, ...bathroomData } = bathroom
    const docRef = await db.collection('bathrooms').add(bathroomData)
    bathroomIdMap.set(id, docRef.id)
  }
  
  console.log('Importing reviews...')
  for (const review of reviews) {
    const { id, bathroomId, ...reviewData } = review
    await db.collection('reviews').add({
      ...reviewData,
      bathroomId: bathroomIdMap.get(bathroomId) ?? String(bathroomId)
    })
  }
  
  console.log('All data imported!')
}

importData()
