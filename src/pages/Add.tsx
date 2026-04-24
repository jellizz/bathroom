import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Add.css'

// The add page, which allows users to select between 2 buttons that prompt them to either
// review an existing bathroom or share a new bathroom. 
// (The buttons don't do anything yet, but will eventually link to the appropriate forms for each action.)

const Add = () => {
    const [text, setText] = useState('') // this is the text for the review form, which will eventually be sent to the backend when the user submits a new review.
    return (

        <div className="add-page">
            <h1>Cornell Bathrooms 🚽</h1>
            <p>Explore and rate bathrooms around campus!</p>
            <div className="button-row">
                <button>Review an existing bathroom</button>
                <button>Share a new bathroom</button>
            </div>

            <h2>Creating a new review</h2>

            <label className="form-group">
                Tell us about it!<br />
                <textarea
                    rows={5}
                    placeholder="Write your review here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </label>
            <button className="submit-button">
                Submit review
            </button>
            <p className="back-link">
                <Link to="/">Back to browsing</Link>
            </p>
        </div>
    )
}

export default Add