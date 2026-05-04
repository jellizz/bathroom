// This file defines the TypeScript types for our application, 
// which will be used to ensure type safety when working with bathroom and review data.


// NOTE: these types will likely evolve as we connect to the database and figure out exactly what data we want to store for each bathroom and review, but this is a starting point based on our current hardcoded data and what we want to display on the frontend.
type Bathroom = {
    firebaseId: string
    name: string
    description: string
    rating: number 
    gender: string
    singleStall: boolean
    wheelchairAccessible: boolean
    hasShower: boolean
    campus: 'North' | 'West' | 'Central'
}

type Review = {
  firebaseId: string
  bathroomId: string
  date: string
  text: string // body of review
  rating: number 
  likes: number
  dislikes: number
  reactions?: Record<string, 'like' | 'dislike'>
  user?: {
    uid: string
    displayName: string
    email: string
    photoURL: string
  }
}

export type { Bathroom, Review }
