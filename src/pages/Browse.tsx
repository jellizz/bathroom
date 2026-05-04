import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Bathroom } from '../types'
import BathroomCard from './BathroomCard'
import Paginator from './Paginator'
import './Browse.css'
import API_BASE from '../config';

// the main page that users see upon visiting the site.
// Displays a list of bathrooms (hardcoded) and a button to add a new bathroom.
// Also has a search bar!

const Browse = () => {
    
    // state variables
    const [query, setQuery] = useState('')
    const [bathrooms, setBathrooms] = useState<Bathroom[]>([])
    const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [campusFilter, setCampusFilter] = useState<'All' | 'North' | 'West' | 'Central'>('All')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // access entire bathroom list via API, set bathrooms state variable to the returned data
    // useEffect so its when it "mounts" (i.e. when the page first loads)
    useEffect(() => {
        /* fetch('http://localhost:5001/api/bathrooms') */
        fetch(`${API_BASE}/bathrooms`)
        .then(res => res.json())
        .then((data: Bathroom[]) => setBathrooms(data))
        .catch(err => console.error('error fetching bathrooms:', err))
    }, [])

    // reset to page 1 when query or sort changes
    useEffect(() => {
        setCurrentPage(1)
    }, [query, sortBy, sortOrder, campusFilter])

    // filter bathrooms based on search query (by name... for now!)
    const filtered = bathrooms.filter((b) => // filtering function
        (b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase())) &&
        (campusFilter === 'All' || b.campus === campusFilter)
    ).sort((a, b) => {
        if (sortBy === 'rating') {
            return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
        } else {
            return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        }
    })

    // pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedBathrooms = filtered.slice(startIndex, startIndex + itemsPerPage)
    
    return (
        <div className="browse-page">
            <h1>Cornell Bathrooms 🚽</h1>
            <p>
                Explore and rate bathrooms around campus!
            </p>
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Enter a location, name, description, or campus..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="filter-section">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}>
                    <option value="rating">Sort by Rating</option>
                    <option value="name">Sort by Name</option>
                </select>
                <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value as 'All' | 'North' | 'West' | 'Central')}>
                    <option value="All">All Campuses</option>
                    <option value="North">North Campus</option>
                    <option value="West">West Campus</option>
                    <option value="Central">Central Campus</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                </button>
            </div>

            <div className="bathroom-list">
            {paginatedBathrooms.map(b => (
                <BathroomCard 
                    key={b.id} 
                    bathroom={b} 
                />
            ))}
            </div>

            <Paginator
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <Link to="/add">
                <button>Create a new review!</button>
            </Link>
        </div>
    )
}

export default Browse