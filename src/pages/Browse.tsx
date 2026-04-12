import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Bathroom } from '../types'
import BathroomCard from './BathroomCard'

// the main page that users see upon visiting the site.
// Displays a list of bathrooms (hardcoded) and a button to add a new bathroom.
// Also has a search bar!

const Browse = () => {
    
    // state variables
    const [query, setQuery] = useState('')
    const [bathrooms, setBathrooms] = useState<Bathroom[]>([])

    // access entire bathroom list via API, set bathrooms state variable to the returned data
    // useEffect so its when it "mounts" (i.e. when the page first loads)
    useEffect(() => {
        fetch('http://localhost:5001/api/bathrooms')
        .then(res => res.json())
        .then((data: Bathroom[]) => setBathrooms(data))
        .catch(err => console.error('error fetching bathrooms:', err))
    }, [])

    // filter bathrooms based on search query (by name... for now!)
    const filtered = bathrooms.filter((b) => // filtering function
        b.name.toLowerCase().includes(query.toLowerCase())
    )
    
    // css formatting? use className stuff (if we want. For now we can keep it ugly lol)
    return (
        <div>
            <h1>Cornell Bathrooms 🚽</h1>
            <p>
                Explore and rate bathrooms around campus!
            </p>
            <div>
                <input
                    type="text"
                    placeholder="Enter a location, name, or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                 <button disabled> Sort by rating (not implemented yet) </button>
            </div>

            <div>
            {filtered.map(b => (
                <BathroomCard 
                    key={b.id} 
                    bathroom={b} 
                />
            ))}
            </div>

            <Link to="/add">
                <button>Create a new review!</button>
            </Link>
        </div>
    )
}

export default Browse