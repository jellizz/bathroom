import { useEffect, useState } from 'react'
import { Link, useParams} from 'react-router-dom'
import type { Bathroom, Review } from '../types'
import LikeDislikeButton from './LikeDislikeButton'
import './BathroomDisplay.css'
import API_BASE from '../config'

// Displays bathroom with details and reviews based on the Firebase document ID in the url.

const BathroomDisplay = () => {
    
    const { id } = useParams() // this is the Firebase document ID from React Router
    const [bathroom, setBathroom] = useState<Bathroom | null>(null) // null if it isn't fetched?
    const [reviews, setReviews] = useState<Review[]>([])

    
    // access the bathroom information via API, using the Firebase document ID.
    useEffect(() => {
        /* fetch(`http://localhost:5001/api/bathrooms/${id}`)  */
        fetch(`${API_BASE}/bathrooms/${id}`)
        .then(res => res.json())
        .then(data => setBathroom(data))
        .catch (err => console.error('error fetching this bathroom:', err))

        // also need to fetch the reviews
        /* fetch(`http://localhost:5001/api/bathrooms/${id}/reviews`) */
        fetch(`${API_BASE}/bathrooms/${id}/reviews`).then(res => res.json())
        .then(data => setReviews(data))
        .catch (err => console.error('error fetching reviews for this bathroom:', err))

    }, [id]) // dependent on id in url.

    if (!bathroom) { // if no bathroom yet (or issues fetching the bathroom)
        return <p>Loading this bathroom...</p>
    }

    return ( // this formatting is a little bit bad...
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
                        <p>Posted {review.date}:</p>
                        <p>{review.text}</p>
                        <LikeDislikeButton review={review} />
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
