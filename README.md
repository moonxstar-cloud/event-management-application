# Event Management Application

Simplify event handling with this backend solution, built using **Node.js**, **Express.js**, and **MongoDB**.

This application offers a RESTful API for secure user authentication, event management, real-time updates, and more.

---

## Features

- **User Authentication**: Secure authentication and authorization with JWT.
- **Event Management**: CRUD operations for event data.
- **File Uploads**: Supports file uploads using Multer.
- **Real-Time Updates**: Real-time communication using WebSockets (ws).
- **Cross-Origin Support**: CORS support for handling cross-origin requests.
- **Environment Management**: Simplified configuration with Dotenv.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **MongoDB** (version 4 or higher)
- **npm** (version 6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/moonxstar-cloud/event-management-application.git
   ```

2. Navigate to the project directory:
   ```bash
   cd event-management-application
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables (see below).

5. Start the application:
   ```bash
   npm start
   ```

---

## Environment Variables

The following environment variables are required:

- **DB_URI**: MongoDB connection string.
- **JWT_SECRET**: Secret key for signing JWTs.
- **PORT**: Port number for the application.

Example `.env` file:

```plaintext
DB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-secret-key
PORT=3000
```

---

## API Endpoints

### Events

- `GET /events`: Fetch a list of all events.
- `POST /events`: Create a new event. (Requires authentication)

  Example Body:
  ```json
  {
    "name": "Conference",
    "date": "2025-01-30"
  }
  ```

- `GET /events/:id`: Fetch details of an event by its ID.
- `PUT /events/:id`: Update an event's details.
- `DELETE /events/:id`: Remove an event.

### Users

- `POST /users`: Register a new user. (Requires a valid email and password)
- `POST /users/login`: Login a user. Returns a JWT token.
- `GET /users/me`: Retrieve current user information. (Requires authentication)

---

## Screenshots

Here are some screenshots of the application:

### 1. Event Mangement
![eventcard](https://github.com/user-attachments/assets/320d7b95-00a3-470e-b071-f46502a764e4) Page![registering for evet](https://github.com/user-attachments/assets/3cdcee95-6322-4a51-8db0-a86b81c1830c)
![register](https://github.com/user-attachments/assets/81ce4218-c63c-4403-9072-d8600796a6df)
![Profile](https://github.com/user-attachments/assets/f917fe67-82f0-415c-ac61-e4736b8f7db3)
![notification as the host gets the attendee of event](https://github.com/user-attachments/assets/6e0a8a80-d20f-40a3-ade7-286d9109cffa)
![Login](https://github.com/user-attachments/assets/d4c5ea74-4d4b-42c1-8e49-ded602cb6b02)
![Joiner](https://github.com/user-attachments/assets/d4b4e779-156c-4d72-b896-90e05a282a05)
![home](https://github.com/user-attachments/assets/65e4ff7a-9247-4160-82d6-b2888653b662)
![Header](https://github.com/user-attachments/assets/5c2aca0f-7d96-4f00-921a-c13eb1639b6b)
![!st page](https://github.com/user-attachments/assets/6f5a9711-b47d-4478-a46a-04a7b7f1f516)
![!st page](https://github.com/user-attachments/assets/54f260fe-7381-438a-8e5a-23abc834f6e4)![Discover](https://github.com/user-attachments/assets/4b2185e7-ae98-48a0-8d59-51e6b3ee3c77)
![Create event](https://github.com/user-attachments/assets/0efaee30-1a3c-4d30-ac96-c60bd1e561b5)
![Approved](https://github.com/user-attachments/assets/2dac621f-85a1-490d-8ad5-c02e9493323d)


## License

This project is licensed under the ISC License.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Make your changes and commit them with meaningful messages.
4. Push your changes to the branch.
5. Submit a pull request.

---

## Authors

- **Saba Rafaqat**

Feel free to connect with me on GitHub  for collaboration.

---

## Acknowledgments

- Thanks to **Moonxstar Cloud** for providing the initial codebase and guidance.

---

