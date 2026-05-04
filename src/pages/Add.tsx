import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Bathroom } from '../types'
import './Add.css'
import API_BASE from '../config'

// Page for adding a new bathroom or reviewing an existing bathroom.
// Two modes: review existing bathroom (select from dropdown) or add new bathroom (fill out form).

const Add = () => {
    const navigate = useNavigate()
    const [mode, setMode] = useState<'review' | 'new'>('review')
    const [bathrooms, setBathrooms] = useState<Bathroom[]>([])
    const [date] = useState(new Date().toISOString().split('T')[0])

    // Review existing bathroom form state
    const [selectedBathroomId, setSelectedBathroomId] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [reviewRating, setReviewRating] = useState(3)

    // Add new bathroom form state
    const [bathroomName, setBathroomName] = useState('')
    const [gender, setGender] = useState('')
    const [campus, setCampus] = useState('')
    const [wheelchairAccessible, setWheelchairAccessible] = useState(false)
    const [singleStall, setSingleStall] = useState(false)
    const [hasShower, setHasShower] = useState(false)

    const buildBathroomDescription = () => {
        const stallType = singleStall ? 'single stall' : 'multi stall'
        const showerText = hasShower ? 'does' : 'does not'
        const accessibleText = wheelchairAccessible ? 'is' : 'is not'

        return `This is a ${gender.toLowerCase()}, ${stallType} bathroom. It ${showerText} have a shower and ${accessibleText} wheelchair accessible.`
    }

    // Fetch bathrooms for the review form dropdown
    useEffect(() => {
        /* fetch('http://localhost:5001/api/bathrooms') */
        fetch(`${API_BASE}/bathrooms`)
            .then(res => res.json())
            .then((data: Bathroom[]) => setBathrooms(data))
            .catch(err => console.error('error fetching bathrooms:', err))
    }, [])

    // 
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const bathroomId = selectedBathroomId

        const response = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bathroomId,
                text: reviewText,
                rating: reviewRating,
                date,
                likes: 0,
                dislikes: 0,
            }),
        })

        if (!response.ok) {
            alert('There was a problem submitting this review.')
            return
        }

        await response.json()
        alert('Review submitted!')
        setReviewText('')
        setReviewRating(3) // defaults to mid rating
        setSelectedBathroomId('')
        navigate(`/bathroom/${bathroomId}`)
    }

    const handleNewBathroomSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const generatedDescription = buildBathroomDescription()

        const response = await fetch(`${API_BASE}/bathrooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: bathroomName,
                description: generatedDescription,
                gender,
                campus,
                wheelchairAccessible,
                singleStall,
                hasShower,
            }),
        })

        if (!response.ok) {
            alert('There was a problem submitting this bathroom.')
            return
        }

        const createdBathroom = await response.json()
        setBathrooms(prevBathrooms => [
            ...prevBathrooms,
            { firebaseId: createdBathroom.firebaseId, ...createdBathroom.data },
        ])

        alert('New bathroom submitted!')
        setBathroomName('')
        setGender('')
        setCampus('')
        setWheelchairAccessible(false)
        setSingleStall(false)
        setHasShower(false)
    }

    // TODO: the top bar should be a component, instead of reusing this text every time...
    return (
        <div className="add-page">
            <h1>Cornell Bathrooms 🚽</h1>
            <p>Share a new bathroom or review an existing one!</p>
            
            <div className="button-row">
                <button
                    className={mode === 'review' ? 'active' : ''}
                    onClick={() => setMode('review')}
                >
                    Review an existing bathroom
                </button>
                <button
                    className={mode === 'new' ? 'active' : ''}
                    onClick={() => setMode('new')}
                >
                    Share a new bathroom
                </button>
            </div>


            {mode === 'review' && (
                <>
                    <h2>Review an Existing Bathroom</h2>
                    <form onSubmit={handleReviewSubmit} className="bathroom-form">
                        <div className="form-group">
                            <label htmlFor="bathroom">Select a Bathroom:</label>
                            <select
                                id="bathroom"
                                value={selectedBathroomId}
                                onChange={(e) => setSelectedBathroomId(e.target.value)}
                                required
                            >
                                <option value="">-- Choose a bathroom --</option>
                                {bathrooms.map(b => (
                                    <option key={b.firebaseId} value={b.firebaseId}>
                                        {b.name} ({b.campus} Campus)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewText">Your Review:</label>
                            <textarea
                                id="reviewText"
                                rows={4}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us about your experience..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewRating">Rating:</label>
                            <select
                                id="reviewRating"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                            >
                                <option value={1}>1  (AWFUL) </option>
                                <option value={2}>2  (Fair)</option>
                                <option value={3}>3  (Good)</option>
                                <option value={4}>4  (Very Good)</option>
                                <option value={5}>5  (Excellent)</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button">
                            Submit Review
                        </button>
                    </form>
                </>
            )}

            {mode === 'new' && (
                <>
                    <h2>Add a New Bathroom</h2>
                    <form onSubmit={handleNewBathroomSubmit} className="bathroom-form">
                        <div className="form-group">
                            <label htmlFor="bathroomName">Bathroom Name/Location:</label>
                            <input
                                type="text"
                                id="bathroomName"
                                value={bathroomName}
                                onChange={(e) => setBathroomName(e.target.value)}
                                placeholder="e.g., Uris Library 2nd Floor"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="gender">Gender:</label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Gender neutral">Gender neutral</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="campus">Campus:</label>
                                <select
                                    id="campus"
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    required
                                >
                                    <option value="">Select campus</option>
                                    <option value="North">North Campus</option>
                                    <option value="West">West Campus</option>
                                    <option value="Central">Central Campus</option>
                                </select>
                            </div>

                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={wheelchairAccessible}
                                    onChange={(e) => setWheelchairAccessible(e.target.checked)}
                                />
                                Wheelchair accessible
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={singleStall}
                                    onChange={(e) => setSingleStall(e.target.checked)}
                                />
                                Single stall
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={hasShower}
                                    onChange={(e) => setHasShower(e.target.checked)}
                                />
                                Has shower
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                readOnly
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Submit Bathroom
                        </button>
                    </form>
                </>
            )}

            <p className="back-link">
                <Link to="/">Back to browsing</Link>
            </p>
        </div>
    )
}

export default Add
