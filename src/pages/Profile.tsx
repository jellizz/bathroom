import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom'; // Remove Link import
import './Profile.css';

interface Bathroom {
  firebaseId: string;
  name: string;
  location?: string;
  createdAt?: string;
}

interface Review {
  firebaseId: string;
  text: string;
  rating: number;
  bathroomName?: string;
  createdAt?: string;
}

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [userBathrooms, setUserBathrooms] = useState<Bathroom[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      setUser(auth.currentUser);
      
      setUserBathrooms([
        { firebaseId: '1', name: 'Baker Lab 2nd Floor', location: 'Central Campus', createdAt: '04-15-2025' },
        { firebaseId: '3', name: 'Statler Hall 2nd Floor', location: 'Central Campus', createdAt: '05-01-2025' },
      ]);
      
      setUserReviews([
        { firebaseId: '1', text: 'kinda really crusty my eyes literally water and i start gagging when i step inside.', rating: 1, bathroomName: 'Baker Lab 2nd Floor', createdAt: '04-15-2025' },
        { firebaseId: '2', text: 'it smellllsss omfg why does it smell. there are too many people using it too, so i can never poop in peace.', rating: 2, bathroomName: 'Uris Library 1st Floor', createdAt: '05-01-2025' },
      ]);
      
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <img 
          src={user?.photoURL || '/pfp.jpg'} 
          alt="Profile" 
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{user?.displayName}</h2>
          <p>{user?.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{userBathrooms.length}</span>
              <span className="stat-label">Bathrooms Added</span>
            </div>
            <div className="stat">
              <span className="stat-number">{userReviews.length}</span>
              <span className="stat-label">Reviews Written</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Bathrooms Section - NO LINKS */}
      <div className="profile-section">
        <h2>My Bathrooms</h2>
        <div className="profile-page-list">
          {userBathrooms.length === 0 ? (
            <p className="empty-message">You haven't added any bathrooms yet.</p>
          ) : (
            userBathrooms.map((bathroom) => (
              <div key={bathroom.firebaseId} className="profile-page-card">
                <h3>{bathroom.name}</h3>
                <p className="profile-page-location">{bathroom.location}</p>
                <p className="profile-page-date">Added: {bathroom.createdAt}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* My Reviews Section - NO LINKS */}
      <div className="profile-section">
        <h2>My Reviews</h2>
        <div className="reviews-list">
          {userReviews.length === 0 ? (
            <p className="empty-message">You haven't written any reviews yet.</p>
          ) : (
            userReviews.map((review) => (
              <div key={review.firebaseId} className="review-card">
                <div className="review-header">
                  <span className="review-profile-page-name">
                    <h3>{review.bathroomName}</h3>
                  </span>
                  <span className="review-rating">{review.rating}/5</span>
                </div>
                <p className="review-text">{review.text}</p>
                <p className="review-date">{review.createdAt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}