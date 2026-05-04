// export default BathroomDisplay
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { Bathroom, Review } from '../types'
import LikeDislikeButton from './LikeDislikeButton'
import './BathroomDisplay.css'
import API_BASE from '../config'
 
// Displays bathroom with details and reviews based on the Firebase document ID in the url.
 
const BathroomDisplay = () => {
 
    const { id } = useParams()
    const [bathroom, setBathroom] = useState<Bathroom | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
 
    // track who's logged in via Google — email is the stable unique identifier
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserEmail(user?.email ?? null)
        })
        return () => unsubscribe()
    }, [])
 
    // access the bathroom information via API, using the Firebase document ID.
    useEffect(() => {
        
        fetch(`${API_BASE}/bathrooms/${id}`)
        .then(res => res.json())
        .then(data => setBathroom(data))
        .catch (err => console.error('error fetching this bathroom:', err))

        // also need to fetch the reviews
        fetch(`${API_BASE}/bathrooms/${id}/reviews`).then(res => res.json())
        .then(data => setReviews(data))
        .catch (err => console.error('error fetching reviews for this bathroom:', err))

    }, [id]) // dependent on firebaseId in url.

    // delete button should only show up if the user is logged in and is the KNOWN author of the review.
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this review?')) return
    try {
        const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail }),  // ← send email
        })
        if (!res.ok) {
            const err = await res.json()
            alert(err.message)  // show "Not authorized" etc.
            return
        }
        setReviews(prev => prev.filter(r => r.firebaseId !== reviewId))
        fetch(`${API_BASE}/bathrooms/${id}`)
            .then(r => r.json())
            .then(data => setBathroom(data))
    } catch (err) {
        console.error('error deleting review:', err)
        alert('Could not delete review. Please try again.')
    }
}
    if (!bathroom) {
        return <p>Loading this bathroom...</p>
    }
 
    return (
        <div className="display-page">
            <Link to="/"><button>Back to browse</button></Link>
            <h1>{bathroom.name}</h1>
 
            <ul className="summary-list">
                <li>Average cleanliness: <strong>{bathroom.rating}/5</strong></li>
                <li>Gender: <strong>{bathroom.gender}</strong></li>
                <li>Single stall: <strong>{bathroom.singleStall ? 'Yes' : 'No'}</strong></li>
                <li>Wheelchair accessible: <strong>{bathroom.wheelchairAccessible ? 'Yes' : 'No'}</strong></li>
                <li>Has shower: <strong>{bathroom.hasShower ? 'Yes' : 'No'}</strong></li>
            </ul>
 
            <h2>Reviews ({reviews.length})</h2>
            <div className="review-list">
                {reviews.length === 0 && <p>No reviews yet!</p>}
                {reviews.map(review => (
                    <div key={review.firebaseId} className="review-item">
                        <div className="review-author">
                            {review.user ? (
                                <>
                                    {review.user.profilePicture && (
                                        <img
                                            src={review.user.profilePicture}
                                            alt={review.user.name}
                                            className="review-avatar"
                                        />
                                    )}
                                    <span className="review-username">{review.user.name}</span>
                                </>
                            ) : (
                                <span className="review-username review-username--anon">👤 Anonymous</span>
                            )}
                        </div>
                        <p>Posted {review.date}:</p>
                        <p>{review.text}</p>
                        <div className="review-actions">
                            <LikeDislikeButton review={review} />
                            {/* show delete only if this review was written by the logged-in user */}
                            {currentUserEmail && review.user?.email === currentUserEmail && (
                                <button
                                    className="delete-review-btn"
                                    onClick={() => handleDeleteReview(review.firebaseId)}
                                >
                                    🗑️ Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
 
            <Link to="/add">
                <button>Add a review for this bathroom</button>
            </Link>
        </div>
    )
}
 
export default BathroomDisplay