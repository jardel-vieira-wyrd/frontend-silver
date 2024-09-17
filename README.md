# Frontend Silver

This repository contains the frontend code for the Silver project. It's built using React, TypeScript, and Vite.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.
Please, before running the project, run the backend project in the following repository:

[Backend Silver](https://github.com/jardel-vieira-wyrd/backend-silver)

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository:
   ```
   git clone https://github.com/jardel-vieira-wyrd/frontend-silver.git
   cd frontend-silver
   ```

2. Build and run the Docker container:
   ```
   docker-compose up --build
   ```

3. The application will be available at [localhost:5173](http://localhost:5173)

### Development

The application is set up with hot-reloading, so any changes you make to the source files will automatically update in the browser.

## Project Structure

- `src/`: Contains the source code for the application
- `public/`: Contains static assets
- `Dockerfile`: Defines the Docker image for the application
- `docker-compose.yml`: Defines the services, networks, and volumes for Docker

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run preview`: Locally preview the production build

