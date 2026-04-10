const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// get all bathrooms 
app.get('/api/bathrooms', (req, res) => {
  res.json({ message: 'GET request - returns list of all bathrooms' })
})

// get a specific bathroom
app.get('/api/bathrooms/:id', (req, res) => {
  res.json({ message: `GET request - returns bathroom ${req.params.id}` })
})

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