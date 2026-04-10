import { Link } from 'react-router-dom'

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