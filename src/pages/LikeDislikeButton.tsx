import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '../firebase'
import type { Review } from '../types'
import './LikeDislikeButton.css'
import API_BASE from '../config'

// shows the likes and dislikes for a given review, allows users to click buttons to like or dislike

export type Props = { 
    review: Review
}

type ReviewResponse = Review | { review: Review }

const getCount = (count: Review['likes'] | Review['dislikes']) => count ?? 0

const getUpdatedReview = (data: ReviewResponse) => (
    'review' in data ? data.review : data
)

const LikeDislikeButton = ({ review }: Props) => {
    const [updatedReview, setUpdatedReview] = useState<Review | null>(null)
    const [user, setUser] = useState<User | null>(auth.currentUser)
    const [localReaction, setLocalReaction] = useState<'like' | 'dislike' | null>(null)
    const [notice, setNotice] = useState('')

    const displayedReview = updatedReview?.firebaseId === review.firebaseId ? updatedReview : review
    const likes = getCount(displayedReview.likes)
    const dislikes = getCount(displayedReview.dislikes)
    const reaction = localReaction ?? (user ? displayedReview.reactions?.[user.uid] ?? null : null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        })

        return () => unsubscribe()
    }, [])

    // PUSH requests to backend to update the likes and dislikes for this review when the buttons are clicked

    const reactToReview = async (type: 'like' | 'dislike') => {
        if (!user) {
            setNotice('Log in to interact with posts')
            return
        }

        if (reaction) {
            setNotice('You already interacted with this review')
            return
        }

        const token = await user.getIdToken()

        fetch(
            `${API_BASE}/reviews/${review.firebaseId}/${type}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            .then(async res => {
                const data = await res.json()

                if (!res.ok) {
                    if (data.review) {
                        setUpdatedReview(data.review)
                        setLocalReaction(data.review.reactions?.[user.uid] ?? null)
                    }
                    throw new Error(data.message || 'Could not update review')
                }

                return getUpdatedReview(data as ReviewResponse)
            }) 
            .then((updated: Review) => {
                setUpdatedReview(updated)
                setLocalReaction(updated.reactions?.[user.uid] ?? type)
                setNotice('')
            })
            .catch(err => {
                setNotice(err.message)
                console.error(`error ${type === 'like' ? 'liking' : 'disliking'} review:`, err)
            })
    }


    return (
        <div className="like-dislike">
            <button
                className={reaction === 'like' ? 'active' : ''}
                disabled={Boolean(reaction)}
                onClick={() => reactToReview('like')}
            >
                Likes ({likes})
            </button>
            <button
                className={reaction === 'dislike' ? 'active' : ''}
                disabled={Boolean(reaction)}
                onClick={() => reactToReview('dislike')}
            >
                Dislikes ({dislikes})
            </button>
            {notice && <span className="interaction-notice">{notice}</span>}
        </div>
    )


}

export default LikeDislikeButton
