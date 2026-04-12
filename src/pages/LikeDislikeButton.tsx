import { useState } from 'react'
import type { Review } from '../types'


// shows the likes and dislikes for a given review, allows users to click buttons to like or dislike

export type Props = {
    review: Review
}

const LikeDislikeButton = ({ review }: Props) => {
    const [likes, setLikes] = useState(review.likes)
    const [dislikes, setDislikes] = useState(review.dislikes)

    // PUSH requests to backend to update the likes and dislikes for this review when the buttons are clicked
    
    const handleLike = () => {
        fetch(
            `http://localhost:5001/api/reviews/${review.id}/like`, // basically, what do we do when we PUSH to this endpoint?
            { method: 'PUT'} // what other stuff do we put here..? 
            )
            .then(res => res.json()) 
            .then((updated: Review) => setLikes(updated.likes))
            .catch(err => console.error('error liking review:', err))
    }

    const handleDislike = () => {
        fetch(
            `http://localhost:5001/api/reviews/${review.id}/dislike`, 
            { method: 'PUT' }
            )
            .then(res => res.json())
            .then((updated: Review) => setDislikes(updated.dislikes))
            .catch(err => console.error('error disliking review:', err))
    }


    return (
        <div>
            <button onClick={handleLike}>Likes ({likes})</button>{' '}
            <button onClick={handleDislike}>Dislikes ({dislikes})</button>
        </div>
    )


}

export default LikeDislikeButton