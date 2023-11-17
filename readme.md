# User Profiing 
A user profiling API written in node JS using express. It handles role based users authentication using JWT and fetches users data and performs CRUD operations on their data.

## Working
We can add users with role of CLIENT or ADMIN. After registartion of user we save the JWT token of user in its profile in tokens array, so the user can login from multiple devices even if logged out from one. After login user gets the JWT that is used for its authentication for fetching or adding data to API. Each user's JWT_CODE is different as corresponding to its role. I used different codes so that one secret code doesn't compromise all roles. But in most cases I user one code because that is easier to manage but for more security I have defined different codes here.
After signup user gets email to verify its account. If user forgets password we can use forget password APIs to recover its password using its email. I send a random code to user's email for verification and then verify that code with verification API. If it matched with the code saved in user's document then we have the user verified else we show him the message of expiry or not correct code.
For admin I have added getUsers API that fetches users with the filters passed in the params. I made it compatible with the dataTables so sending and receiving data is easier for the datatables used in client side.
Also I have added add bulk users endpoint for adding bulk random users, you can specify the count of users to be added by passing count in query params of the endpoint.

## APIs
I have added the following APIs in the app:

 ### For Admin Usage
 1. Adding a new admin by admin
 2. fetching users data with filters/params of (page, limit, search, sortBy, isVerified, userType, order)
 3. Update user
 4. Delete User
 5. Get User Details
 6. Add bulk users script
 7. Add user

 ### For Client Usage
 1. Registration
 2. Login
 3. Update Profile
 4. Get Authenticated user Info
 5. Forget password
 6. Reset Password Verification
 7. Email Verification
 8. Logout User

## Running the app in dev mode
To run the app in development mode run the following:
1. npm install
2. Add the .env file in main directory
2. npm run dev
