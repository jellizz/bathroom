
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// because we don't have a database yet, I hardcoded some bathroom data to test the API routes.
// will be removed once we have a database we can pull from instead.

const bathrooms = require('./data/bathrooms.json')
const reviews = require('./data/reviews.json')

// get all bathrooms 
app.get('/api/bathrooms', (req, res) => {
  res.json(bathrooms)
})

// get a specific bathroom based on id
app.get('/api/bathrooms/:id', (req, res) => {

  const bathroom = bathrooms.find(b => b.id === Number(req.params.id))
  if (!bathroom) { 
    return res.status(404).json({ message: `Bathroom with id ${req.params.id} not found` })
  }
  res.json(bathroom)
})

// get a specific bathroom's reviews based on id
app.get('/api/bathrooms/:id/reviews', (req, res) => {
  const bathroomReviews = reviews.filter(r => r.bathroomId === Number(req.params.id))
  res.json(bathroomReviews)
})

// This is good practice for PUSHing info to server (such as a user liking a review)

// increment likes for a specific review (they have their own ids separate from bathroom id)
app.put('/api/reviews/:id/like', (req, res) => { 
  const review = reviews.find(r => r.id === Number(req.params.id))
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  review.likes += 1 // so it actually updates the number of likes in the server data, not just on the frontend
  res.json(review)
})

// increment dislikes for a review (same deal)
app.put('/api/reviews/:id/dislike', (req, res) => {
  const review = reviews.find(r => r.id === Number(req.params.id))
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  review.dislikes += 1
  res.json(review)
})


// TODO: flesh these out!

// makes new bathroom profile
app.post('/api/bathrooms', (req, res) => {
  res.json({ message: 'POST request - creates new bathroom', data: req.body })
})

// updates a bathroom's info
app.put('/api/bathrooms/:id', (req, res) => {
  res.json({ message: `PUT request - updates bathroom ${req.params.id}`, data: req.body })
})

// deletes a bathroom profile
app.delete('/api/bathrooms/:id', (req, res) => {
  res.json({ message: `DELETE request - removes bathroom ${req.params.id}` })
})

const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})