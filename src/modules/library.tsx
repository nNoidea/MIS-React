import { copyMovie, Movie } from "../classes/Movie";
import { singlePageResults } from "./searchResults";

// Initiate the database
let db: any;
const request = indexedDB.open("library", 2);
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;

    // Delete the already existing database if it exists and if it's required by me.
    if (db.objectStoreNames.contains("movies") && true) {
        db.deleteObjectStore("movies");
    }

    // Create a new 'movies' object if it doesn't exists.
    if (!db.objectStoreNames.contains("movies")) {
        db.createObjectStore("movies", { keyPath: "uniqueID" });
    }
};

request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
};

request.onerror = () => {
    console.error("Error opening database:", request.error);
};

// Setup the setter / getter object.
function createObjectStore() {
    return db.transaction(["movies"], "readwrite").objectStore("movies");
}

// Methods to do stuff.
export function addToLibrary(movie: Movie) {
    const objectStore = createObjectStore();
    objectStore.put(movie);
}

export function removeFromLibrary(uniqueID: string) {
    const objectStore = createObjectStore();
    objectStore.delete(uniqueID);
}

export async function checkIfItemExists(uniqueID: string) {
    const objectStore = createObjectStore();

    return new Promise((resolve, reject) => {
        const request = objectStore.get(uniqueID);
        request.onsuccess = (event: Event) => {
            const result = (event.target as IDBRequest).result;

            if (result == undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export function getFromLibrary(uniqueID: string): Promise<Movie> {
    const objectStore = createObjectStore();

    return new Promise<Movie>((resolve, reject) => {
        const request = objectStore.get(uniqueID);
        request.onsuccess = (event: Event) => {
            const result: Movie = copyMovie((event.target as IDBRequest).result);

            resolve(result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export function loadLibrary(GLOBALS: any) {
    const { setContent } = GLOBALS.SETTERS;
    const objectStore = createObjectStore();

    objectStore.getAll().onsuccess = async (event: any) => {
        let movieArrayDB = event.target.result;
        let movieArray: Movie[] = [];
        for (let i = 0; i < movieArrayDB.length; i++) {
            movieArray.push(copyMovie(movieArrayDB[i]));
        }

        await setContent(
            <>
                <div
                    className="grid-container"
                    id="searchResults"
                >
                    {singlePageResults(GLOBALS, movieArray)}
                </div>
            </>
        );
    };
}
