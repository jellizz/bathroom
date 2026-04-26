```
C o r n e l l    B a t h r o o m

FEATURES
    - Find awesome bathrooms on campus, avoid not-so-awesome bathrooms 
    - Rate bathrooms and read real reviews
    - Filter bathrooms by location, gender, accessibility, showers, stalls
    - Discover and share new bathrooms



BACKEND SETUP
    Using Cloud Authentication:
        1. Install Google Cloud CLI
        2. Navigate to backend folder:
            cd backend    
        2. Authenticate your Google account:
            gcloud auth login
        3. Select this Firebase project: 
            gcloud config set project cornell-bathroom
        4. Set up local credentials:
            gcloud auth application-default login
        5. Start the server:
            node server.js

    Using Service Account Key:
        1. Put key into a file named 'service-account-key.json' in the 'backend' directory.

BACKEND ARCHITECTURE
    Local Server
        Command: node backend/server.js
        Runs on localhost:5001
    Vercel Dev
        Command: vercel dev
        Runs on localhost:3000
        Use to locally test Vercel deployment
    Production
        Linked
```
