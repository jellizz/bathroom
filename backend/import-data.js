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

// for finding the avg for uploading...
const averageRatingForBathroom = (bathroomId) => {
  const ratings = reviews
    .filter(review => review.bathroomId === bathroomId)
    .map(review => review.rating)
    .filter(rating => typeof rating === 'number')

  if (ratings.length === 0) {
    return 0
  }

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

async function importData() {
  console.log('Importing bathrooms...')
  const bathroomIdMap = new Map()

  for (const [index, bathroom] of bathrooms.entries()) {
    const seedBathroomId = index + 1
    const docRef = await db.collection('bathrooms').add({
      ...bathroom,
      rating: averageRatingForBathroom(seedBathroomId)
    })
    bathroomIdMap.set(seedBathroomId, docRef.id)
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
