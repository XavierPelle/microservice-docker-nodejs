# Admin Service

This project is an Admin Microservice built with Node.js and Express. It provides functionalities for managing admin users, including creating, updating, and deleting admin accounts.

## Project Structure

```
admin-service
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── database.js       # Database configuration
│   ├── controllers
│   │   └── admin.controller.js # Controller for admin operations
│   ├── models
│   │   └── Admin.js          # Admin model
│   └── routes
│       └── admin.route.js    # Routes for admin operations
├── Dockerfile                 # Docker configuration
├── package.json               # NPM configuration
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker (for containerization)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd admin-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To run the application locally, use the following command:
```
node src/app.js
```

### Docker

To build and run the Docker container, use the following commands:
```
docker build -t admin-service .
docker run -p 5000:5000 admin-service
```

### API Endpoints

- `POST /admin`: Create a new admin
- `GET /admin/:id`: Retrieve an admin by ID
- `PUT /admin/:id`: Update an admin by ID
- `DELETE /admin/:id`: Delete an admin by ID

### License

This project is licensed under the MIT License.