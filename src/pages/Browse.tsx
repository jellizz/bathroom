import { Link } from 'react-router-dom'

const Browse = () => {
    return (
        <div>
            <h1>Cornell Bathrooms</h1>
            <Link to="/add">
                <button>Add a new bathroom!</button>
            </Link>
            
            <div style={{marginTop: '15px'}}>
                <Link to="/bathroom/1">
                    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }} >
                        <strong>Baker Lab basement bathroom</strong>
                        <p>Rating: 3.5/5</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Browse