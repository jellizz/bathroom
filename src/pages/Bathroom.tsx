import { Link, useParams } from 'react-router-dom'

const Bathroom = () => {
    const{ id } = useParams()
    
    return (
        <div>
            <h1>The Baker Lab Basement Bathroom</h1>
            <p>A single-room, gender-neutral bathroom!</p>
            <Link to="/add">
                <button>Add a review for this bathroom.</button>
            </Link>
        </div>
    )
}

export default Bathroom