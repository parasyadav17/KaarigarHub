# KaarigarHub

**KaarigarHub** is a platform designed to bridge the gap between skilled blue-collar workers (Kaarigars) and customers (Contractors or Individuals) looking for their services. It aims to organize the unorganized sector of daily wage workers by providing a digital space to showcase their skills and connect with potential employers.

## Problem Statement

In the current market, finding reliable skilled workers like electricians, plumbers, carpenters, etc., is often difficult and relies heavily on word-of-mouth. Conversely, skilled workers often struggle to find consistent work and lack a platform to showcase their portfolio and reputation. KaarigarHub solves this by creating a centralized marketplace for local services.

## Tech Stack

This project is built using the **MERN** stack:

*   **Frontend**: React (Vite), Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: JWT, BCrypt
*   **Image Storage**: Cloudinary
*   **Email Service**: Nodemailer

## Main Users

The platform caters to three main types of users:

1.  **Admin**: Manages the overall platform, categories, and users.
2.  **Worker (Kaarigar)**: Skilled professionals who create profiles, list their skills, and apply for jobs or receive service requests.
3.  **Contractor (Customer)**: Users who post jobs, search for workers, and hire them for specific tasks.

## How to Run the Project

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js installed
*   MongoDB installed and running (or a MongoDB Atlas connection string)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and configure your environment variables (PORT, MONGODB_URL, JWT_SECRET, CLOUDINARY credentials, RAZORPAY credentials, MAIL variables).
4.  Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

