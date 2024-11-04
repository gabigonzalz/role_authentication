
# Role-based User Profile Management

This project implements a user profile management system using Express.js, EJS for templating, and JWT/cookie sessions for authentication. 

It allows users to view and edit their profiles, log out, and access an admin panel, all while ensuring secure communication through CSRF protection and token management.




## Tech Stack

- **Node.js**: Backend framework for building the server.
- **Express.js**: Web framework for Node.js.
- **EJS**: Templating engine for rendering HTML views.
- **JWT**: JSON Web Tokens for user authentication.
- **CSRF Tokens**: For protecting against Cross-Site Request Forgery attacks.
- **MongoDB**: For handling and storing data
- **bCrypt**: For hashing passwords and keeping data encrypted
- **DOMPurify**: To filter any user inputs from malicious scripts
- **Cookie-Parser**: To parse the yummy cookies


## Project structure
```bash
.env                    # Environment configuration file
package.json            # Project metadata and dependencies
/src                    # Source files for the application
├── main.js            # Entry point for the application
├── config             # Configuration settings (e.g., database, environment variables)
├── controller         # Business logic and request handling
├── middlewares        # Custom middleware functions for request processing
├── models             # Data models and schema definitions
├── routes             # Route definitions and URL handling
└── views              # EJS templates for rendering HTML views
                            
```
## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/user-profile-management.git
cd user-profile-management
```
2. Install the dependencies
```bash
npm install
```
3. Environment Configuration:
Create a ***.env*** file in the root directory and configure the following environment variables:
```bash
PORT=3000
JWT_SECRET=your_jwt_secret_key
``
4. Run the application:
```bash
npm run dev
```
*The application will be running on http://localhost:3000.*


## Contributing

Contributions are **always** welcome!

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. 

Any improvements or bug fixes are welcome!
