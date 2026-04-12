import { useState } from 'react'
import { Link } from 'react-router-dom'

// The add page, which allows users to select between 2 buttons that prompt them to either
// review an existing bathroom or share a new bathroom. 
// (The buttons don't do anything yet, but will eventually link to the appropriate forms for each action.)

const Add = () => {
    const [text, setText] = useState('') // this is the text for the review form, which will eventually be sent to the backend when the user submits a new review.
    return (

        <div>
            <h1 style={{ textAlign: 'center' }}>Cornell Bathrooms 🚽</h1>
            <p style={{ textAlign: 'center' }}>Explore and rate bathrooms around campus!</p>
            <div style={{ justifyContent: 'center', display: 'flex', gap: '20px', marginTop: '15px' }}>
                <button style={{ height: '50px', width: '200px', fontSize: '16px' }}>
                     Review an existing bathroom
                </button>
                <button style={{ height: '50px', width: '200px', fontSize: '16px' }}>
                    Share a new bathroom
                </button>
            </div>

            <h2>Creating a new review</h2>

            <label style={{ display: 'block' }}>
                Tell us about it!<br />
                <textarea
                    rows={5}
                    placeholder="Write your review here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{ marginTop: '6px', padding: '8px', width: '90%', boxSizing: 'border-box'}}
                />
            </label>
            <button style={{ height: '50px', width: '150px', fontSize: '16px', backgroundColor: '#adff9f', border: 'none', borderRadius: '5px'}}>
                Submit review
            </button>
            <p style={{ marginTop: '15px'}}>
                <Link to="/">Back to browsing</Link>
            </p>
        </div>
    )
}

export default Add