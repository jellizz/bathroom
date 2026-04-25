import { Link } from 'react-router-dom'
import type { Bathroom } from '../types'
import './BathroomCard.css'


// Displays the information about a specific Bathroom, organized on Browse page.

interface Props {
  bathroom: Bathroom
}

// also links to a new page for a specific bathroom (based on id)

const BathroomCard = ({ bathroom }: Props) => {
  return (
    <div className="bathroom-card">
      <h3>{bathroom.name}</h3>
      <p><strong>{bathroom.description}</strong></p>
      <p>Average rating: {bathroom.rating}/5</p>
      <p>Campus: {bathroom.campus}</p>
      <p>
        <strong>Read bathroom goers' reviews </strong>
        <Link to={`/bathroom/${bathroom.id}`}>here</Link>
      </p>
    </div>
  )
}

export default BathroomCard