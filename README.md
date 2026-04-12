C o r n e l l    B a t h r o o m


we need a cooler name and better description

temp description of our notes for MS2:

Bathroom tier list - data tracker, user input, forum?
- Clean/dirty
- Privacy
- Sitting rooms
- Showers
- Single-room gender-neutral bathrooms 
- Accessible 

MS2:
- Skeleton of a website
- Established your frontend pages
- Outlined the API routes you plan on implementing in Express
- Your frontend and backend should be properly connected and can communicate with one another locally

Requirements
- Frontend UI (at least 3 pages)
- Express API & server that supports HTTP requests
at least one of each HTTP request type (GET, POST, PUT, DELETE)

Frontend UI Pages:

- Browse bathrooms page
    - RMP-style list of bathroom ratings page
    - Name (“[building name] [x] floor [gender] bathroom”) and picture (?)
    - Overall x-star review bathroom
    - Should be able to filter by:
        - Location (building, floor)
        - Gender 
        - Clean/dirty
        - Privacy
        - Sitting rooms
        - Showers
        - Single-room gender-neutral bathrooms 
        - Accessible 
- Clicking a bathroom leads to its bathroom profile page
    - Should have “add new bathroom” button that leads to user data input page
- Individual bathroom profile page
    - Location (building, floor), gender, picture(?)
    - Overall x-star review 
    - Tags (privacy, sitting room, etc)
    - User input/commentary/ratings/reviews
    - Should have “add review/rating” button that leads to user data input page
- User data input page
    - Add info for new bathroom
    - Add review for current bathroom

- If we have time…
    - User profile pages
    - Bathroom chat forum page

- Backend API:
- HTTP requests:
	GET: all bathrooms data → specific bathroom
	POST: add new bathroom
		add review to existing bathroom
	PUT: update bathroom info (avg rating, tags)
	DELETE: delete bathroom review
