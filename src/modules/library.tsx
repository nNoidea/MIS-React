import { Movie, MovieList } from "../classes/Movie";
import { singlePageResults } from "./searchResults";

// Initiate the database
let db: any;
const request = indexedDB.open('library');
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;
    db.createObjectStore('movies', { keyPath: 'uniqueID' });
};

request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
};

request.onerror = (event: Event) => {
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
        let list = event.target.result;
        let arrayOfMovies = [];
        for (let i = 0; i < list.length; i++) {
            arrayOfMovies.push(new Movie(list[i].title, list[i].id, list[i].poster, list[i].mediaType, list[i].description, list[i].releaseDate, list[i].genres));
        }

        let movieList = new MovieList(1, arrayOfMovies);

        await GLOBALS.SETTERS.setContent(
            <>
                <div className="grid-container" id="searchResults">
                    {singlePageResults(GLOBALS, movieList)}
                </div>
            </>
        );
    };

}