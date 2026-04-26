const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log(`Using API: ${API_BASE}`);

export default API_BASE;