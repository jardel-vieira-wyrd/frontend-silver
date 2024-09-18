# Frontend Silver

This repository contains the frontend code for the Silver project. It's built using React, TypeScript, TailwindCSS, shadcn/ui and Vite.

The project is a simple task manager, with the following features:
- Register and login using email and password (JWT Authentication)
- Create new Projects with almost one task
- Create new tasks in a project and set the author as 'owner'
- Assign a user executor to the task (only the owner can assign)
- Add stakeholders with read-only access to the task (only the owner can add)
- Change the status of a task (to do, in progress, done, canceled)
- Change the priority of a task (0 to 5, 5 is the highest priority)
- View the task details, including the author, executor, stakeholders
- Visualize the project board with the tasks order by status and priority
- Visualize the team board with the tasks grouped by users

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

- `public/`: Contains static assets that are copied to the build folder as-is.
- `src/`: The main source directory for your application code.
  - `api/`: Contains API-related code, such as API calls and configurations.
  - `assets/`: Stores static assets like images, fonts, and ui elements.
  - `blocks/`: Contains blocks of ui elements (like AddTask).
  - `components/`: Contains components constructed with shadcn/ui and blocks.
  - `layouts/`: Contains layout components used across multiple pages.
  - `pages/`: Includes layout and components that represent entire pages or routes.
  - `stores/`: Contains state management logic (using Zustand).
  - `test/`: Includes test setup files and potentially shared test utilities.
  - `utils/`: Houses utility functions and helper modules.
- `App.tsx`: The main entry point for the application.
- Other root files: Configuration files for TypeScript, Vite, Git and npm.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run preview`: Locally preview the production build
- `npm run test`: Run the tests

## Testing

There are a example of tests in the `src/blocks/__tests__/AddTask.test.tsx` file. 
We use `vitest` to run the tests.

To run the tests, run the following command:

```
npm run test
```

The results will be displayed in the console:

```
 ✓ src/blocks/__tests__/AddTask.test.tsx (1)
   ✓ AddTask (1)
     ✓ renders correctly

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  07:05:40
   Duration  443ms
```
There are a Deprecartion Warning in 'punycode' module.
The version used is punycode@2.3.1, that is not deprecated.
The warning can be ignored.