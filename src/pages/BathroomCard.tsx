import { Link } from 'react-router-dom'
import type { Bathroom } from '../types'


// Displays the information about a specific Bathroom, organized on Browse page.

interface Props {
  bathroom: Bathroom
}

// also links to a new page for a specific bathroom (based on id)

const BathroomCard = ({ bathroom }: Props) => {
  return (
    <div style={{ border: '1px solid #4d8fc9', padding: '20px', margin: '10px', backgroundColor: '#BDE0EE' }}  >
      <h3 style={{ color: '#242424' }}>{bathroom.name}</h3>
      <p><strong>{bathroom.description}</strong></p>
      <p>Average cleanliness: {bathroom.rating}/5</p>
      <p> 
        <strong>Read bathroom goers' reviews </strong>
        <Link to={`/bathroom/${bathroom.id}`}>here</Link>
      </p>
    </div>
  )
}

export default BathroomCard