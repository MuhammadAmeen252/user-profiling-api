## User Profiing 
A user profiling API writeen in node JS using express. It handles used authentication via role using JWT.

# Working
We can add users of with role of CLIENT or ADMIN. After registartion of user we save the JWT token of user in its profile in tokens array, so the user can login from multiple devices even if logged out from one. After login user gets the JWT that is used for its authentication for fetching or adding data to API. Each user's JWT_CODE is different as corresponding to its role. So one secret code doesn't automatically compromise all roles but in most cases I user one code because that is easier to manage but for more security I have defined different codes here.
After signup user gets email to verify its account. If user forgets password we can use forget password APIs to recover its apssword using its email. I send a random code to user's email for verification and then verify that code with verification API. If it matched with the code saved in user's document then we have the user verified else we show him the message of expiry or not correct code.
For admin I have added getUsers API that fetches users with the filters passed in the params. I made it compatible with teh dataTables so sending and receiving data is easier for the datatables used in client side.

# APIs
I have added the following APIs in the app:
 # For Admin Usage
 1. Adding a new admin by admin
 2. fetching users data with filters/params of (page, limit, search, sortBy, isVerified, userType, order)

 # For Client Usage
 1. Registration
 2. Login
 3. Update Profile
 4. Get Authenticated user Info
 5. Forget password
 6. Reset Password Verification
 7. Email Verification
 8. Logout User


# Adding a new admin
Currently there is no script to add an admin so you have to comment the 'if' condition written in registerUser controller that checks for admin role when adding new admin. After that you can add admin by specifying its name, email, password and userType='ADMIN' by register user route. After an admin is added then he can add a new admin or client form '/api/admin/register' route.

# Running the app in dev mode
To run the app in development mode run the following:
1. npm install
2. Add the .env file in main directory
2. npm run dev

# Note
My email sending key used in sendGrid is expired and my new account isn't verified yet. So email may not be sent but I have added all the email sending code. So you can get better idea of how I implement it.