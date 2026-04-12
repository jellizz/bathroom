import { Link } from 'react-router-dom'

// The add page, which allows users to select between 2 buttons that prompt them to either
// review an existing bathroom or share a new bathroom. 
// (The buttons don't do anything yet, but will eventually link to the appropriate forms for each action.)

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