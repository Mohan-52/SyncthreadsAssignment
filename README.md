# SyncthreadsAssignment Backend

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- - [Packages Used](#packages-used)
  
## Overview
This is the backend project for the SyncthreadsAssignment, built using Node.js and Express. It provides RESTful API endpoints for:
- User authentication (login, signup)
- Dashboard data retrieval (city details)
- Map configuration (default map settings)

The project uses SQLite as its database and JSON Web Tokens (JWT) to secure endpoints.

## Features
- **User Authentication:** Secure login and signup endpoints.
- **Dashboard Data:** Returns city data for the frontend dashboard.
- **Map Configuration:** Provides default map settings for the map view.
- **Protected Endpoints:** Uses JWT to protect sensitive routes.
- **SQLite Database:** Lightweight database for managing users and city records.

## Installation

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm

### Setup Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Mohan-52/SyncthreadsAssignment.git
2.Navigate to the project directory:
cd server

3.Install the dependencies:
npm install

4.Run the Server::
node server.js

## Packages Used

**Core Packages**:
1.express
A minimal and flexible Node.js web application framework for building RESTful APIs.

2.cors
Middleware for enabling Cross-Origin Resource Sharing (CORS), which allows your frontend to access the backend.

3.jsonwebtoken
For creating and verifying JWT tokens to secure API endpoints.

4.sqlite3
A lightweight, disk-based database to store data for the application.

5.dotenv
Loads environment variables from a .env file into process.env.

