import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Bathroom } from '../types'
import BathroomCard from './BathroomCard'
import './Browse.css'

// the main page that users see upon visiting the site.
// Displays a list of bathrooms (hardcoded) and a button to add a new bathroom.
// Also has a search bar!

const Browse = () => {
    
    // state variables
    const [query, setQuery] = useState('')
    const [bathrooms, setBathrooms] = useState<Bathroom[]>([])
    const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'rating') {
            return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
        } else {
            return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        }
    })
    
    return (
        <div className="browse-page">
            <h1>Cornell Bathrooms 🚽</h1>
            <p>
                Explore and rate bathrooms around campus!
            </p>
            <div className="browse-actions">
                <input
                    type="text"
                    placeholder="Enter a location, name, or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}>
                    <option value="rating">Sort by Rating</option>
                    <option value="name">Sort by Name</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                </button>
            </div>

            <div className="bathroom-list">
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