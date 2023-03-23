import { Movie } from "../classes/Movie";
import { singlePageResults } from "./searchResults";

// Initiate the database
let db: any;
const request = indexedDB.open('library', 1);
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;

    // Delete the already existing database if it exists and if it's required by me.
    if (db.objectStoreNames.contains('movies') && false) {
        db.deleteObjectStore('movies');
    }

    // Create a new 'movies' object if it doesn't exists.
    if (!db.objectStoreNames.contains('movies')) {
        db.createObjectStore('movies', { keyPath: 'uniqueID' });
    }
};

request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
};

request.onerror = () => {
    console.error('Error opening database:', request.error);
};

// Setup the setter / getter object.
function createObjectStore() {
    return db.transaction(['movies'], 'readwrite').objectStore('movies');
}

// Methods to do stuff.
export function addToLibrary(movie: Movie) {
    const objectStore = createObjectStore();
    objectStore.add(movie);
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

        request.onerror = (event: Event) => {
            reject(request.error);
        };
    });
}

export function loadLibrary(GLOBALS: any) {
    const objectStore = createObjectStore();

    objectStore.getAll().onsuccess = async (event: any) => {
        let movieArrayDB = event.target.result;
        let movieArray: Movie[] = [];
        for (let i = 0; i < movieArrayDB.length; i++) {
            movieArray.push(new Movie(
                movieArrayDB[i].title,
                movieArrayDB[i].id,
                movieArrayDB[i].poster,
                movieArrayDB[i].mediaType,
                movieArrayDB[i].description,
                movieArrayDB[i].releaseDate,
                movieArrayDB[i].genres
            ));
        }

        await GLOBALS.SETTERS.setContent(
            <>
                <div className="grid-container" id="searchResults">
                    {singlePageResults(GLOBALS, movieArray)}
                </div>
            </>
        );
    };

}