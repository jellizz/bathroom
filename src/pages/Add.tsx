import { Link } from 'react-router-dom'


// A new webpage with one button to add a new bathroom, and one to review an existing bathroom.
// also links back to the main browse page

const Add = () => {
    return (
        <div>
            <h1>Add a new bathroom or review a bathroom!</h1>
            <div style={{display: 'flex', gap: '20px', marginTop: '15px' }}>
                <button>Review an existing bathroom</button>
                <button>Share a new bathroom</button>
            </div>
            <p style={{ marginTop: '15px'}}>
                <Link to="/">Return to browse all bathrooms</Link>
            </p>
        </div>
    )
}

export default Add