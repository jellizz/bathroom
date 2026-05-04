// This file defines the TypeScript types for our application, 
// which will be used to ensure type safety when working with bathroom and review data.

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
  text: string
  rating: number
  likes: number
  dislikes: number
  user?: // based on google user info, optional because we might want to allow anonymous reviews?
    {
      name: string
      email: string
      profilePicture: string 
    }

}

export type { Bathroom, Review }
