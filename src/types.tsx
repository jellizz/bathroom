// This file defines the TypeScript types for our application, 
// which will be used to ensure type safety when working with bathroom and review data.

type Bathroom = {
    id: number
    name: string
    description: string
    rating: number
    gender: string
    singleStall: boolean
    wheelchairAccessible: boolean
    hasShower: boolean
}

type Review = {
  id: number
  bathroomId: number
  date: string
  text: string
  likes: number
  dislikes: number
}

export type { Bathroom, Review }