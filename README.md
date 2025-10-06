# TRPG React Native Frontend Project

This is a frontend for a mobile application designed for TRPGs (Tabletop Role-Playing Games), developed using the React Native and Expo frameworks. The application aims to provide players with a convenient platform to manage and conduct their games.

## Features

Based on the project structure, the following main features are included:

- **User Authentication**:
  - Sign up for a new account
  - Log in and log out
- **Game Management**:
  - The home screen displays user-related information
  - Option to create a new game or load an existing one
- **COC (Call of Cthulhu) Game Module**:
  - Browse a list of COC games
  - Enter a specific game room to play
  - A dedicated side drawer navigation for in-game use
- **Settings**:
  - A personalized user settings page

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Development and Build Tool**: [Expo](https://expo.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (for in-game message flow), React Context API (`AuthContext`)
- **API Client**: `client.js` for communicating with the backend server

## Development Challenges & Solutions

In the early stages of development, the project faced challenges with managing complex data flows, especially when handling real-time in-game chat messages. Relying solely on React Native's native state management methods became difficult to maintain and impacted development efficiency.

To address this issue, **Zustand** was introduced as a state management solution. With Zustand, we can more effectively centralize the management and processing of chat message state and display logic. This change not only simplified data passing between components but also significantly improved development speed and code maintainability.

## Installation and Setup

Please follow the steps below to set up and run the project.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your mobile device (for development and testing)

### Steps

1.  **Clone the repository**

    ```bash
    git clone https://github.com/sauheiwong/trpg-react-native-fontend.git
    ```

2.  **Navigate to the project directory**

    ```bash
    cd trpg-react-native-fontend
    ```

3.  **Install dependencies**
    (The project includes a `package-lock.json`, so npm is recommended)

    ```bash
    npm install
    ```

4.  **Start the development server**

    ```bash
    npm start
    ```

5.  **Run on your mobile device**

    - Once the server starts, a QR code will be displayed in the terminal.
    - Open the Expo Go app on your phone and scan the QR code to load the application.

## Important Notes

- This project is a **frontend-only** application. All game logic, data, and user authentication require a corresponding backend server to function. You will need to ensure the backend service is running and configure the correct API address in `src/api/client.js`.
