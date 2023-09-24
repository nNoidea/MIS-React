# Motion Is Superior

## Installation Instructions

To set up MIS for development, follow these steps:

1. Navigate to the MIS-React directory using the command line:

    ```
    cd MIS-React
    ```

2. Install the necessary dependencies:

    ```
    npm install
    ```

3. Start the development server:
    ```
    npm start
    ```

## Important Notes

Please read these important notes before using MIS:

-   MIS is currently in development, so expect changes. Your movie and series database may break or not work in later versions.

-   MIS uses the `indexedDB` API to save data locally in your browser. Clearing your browser data may result in permanent data loss.

## How MIS Works

MIS relies heavily on the backend for media content. Making changes on the client side may cause issues or result in being banned by the backend.

### Database

-   User data is stored in `IndexedDB` with timestamps. If a media's timestamp is outdated, an API request updates it.

### Cloud