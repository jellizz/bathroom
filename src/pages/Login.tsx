import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './Login.css'; 

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (user) {
    return (
      <div className="user-info">
        <Link to="/profile" className="username-link">
          <span className="username">{user.displayName}</span>
        </Link>
        <button className="logout-button" onClick={logOut}>Logout</button>
      </div>
    );
  }

  return <button className="login-button" onClick={signIn}>Login with Google</button>;
}