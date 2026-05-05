# C o r n e l l   B a t h r o o m

**9/10 Cornellians say that they're still looking for... the one. After class, that coffee you drank an hour ago is coming back to haunt you. All you need is... the one. That quiet stall, where you can sit alone with your thoughts and live without fear of people hearing your rear.**

**FIND THE ONE TODAY!**


**FEATURES**
    - Find awesome bathrooms on campus, avoid not-so-awesome bathrooms (sort by low-high...)
    - Rate bathrooms and read real reviews by Cornellians!
    - Filter bathrooms by location, gender, accessibility, showers, stalls
    - Discover and share new bathrooms across campus


**NOTES**: For best viewing experience, please use device LIGHT MODE on a desktop or LAPTOP screen. This website is not optimized to support mobile devices and dark mode. 


**Dev Notes**
```
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
