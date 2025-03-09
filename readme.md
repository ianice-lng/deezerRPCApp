# Deezer RPC App

Deezer RPC App is an Electron application that displays the currently playing music information from Deezer in your Discord status using Discord Rich Presence.

## Prerequisites

- Node.js
- npm
- A Discord account with a configured Discord Rich Presence application

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/ianice-lng/deezerRPCApp.git
    cd deezerRPCApp
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

## Usage

1. Ensure that your Discord Rich Presence application is configured and that you have the correct `clientId` in the `index.js` file.

2. Start the application:

    ```bash
    npm start
    ```

3. Open Deezer in the application and start playing music. The currently playing music information will automatically update in your Discord status.

## Features

- Displays the song title, artist, and cover image in your Discord status.
- Displays the elapsed time and remaining time of the song.
- Adds a button to listen to the song on Deezer.

## Development

To contribute to the development of this application, follow these steps:

1. Fork this repository.
2. Create a branch for your feature (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add my feature'`).
4. Push your branch (`git push origin feature/my-feature`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.