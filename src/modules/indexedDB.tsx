import { Media, Movie, TV, copyMedia } from "../classes/Media";

// Initiate the database
let db: IDBDatabase | undefined;
const request = indexedDB.open("library", 4);
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;

    // Delete the already existing database if it exists.
    if (db.objectStoreNames.contains("media")) {
        db.deleteObjectStore("media");
    }

    // Create a new 'movies' object if it doesn't exists.
    if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "uniqueID" });
    }
};

request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
};

request.onerror = () => {
    throw new Error("Database is not initialized!");
};

// Setup the setter / getter object.
function createObjectStore() {
    if (!db) {
        throw new Error("Database is not initialized!");
    }
    return db.transaction(["media"], "readwrite").objectStore("media");
}

// Methods
export function libraryAdd(media: Media) {
    const objectStore = createObjectStore();
    objectStore.put(media);
}

export function libraryRemove(uniqueID: string) {
    const objectStore = createObjectStore();
    objectStore.delete(uniqueID);
}

export async function libraryCheck(uniqueID: string): Promise<boolean> {
    const objectStore = createObjectStore();

    return new Promise<boolean>((resolve, reject) => {
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

export function libraryGet(uniqueID: string): Promise<Movie | TV> {
    const objectStore = createObjectStore();

    return new Promise<Movie | TV>((resolve, reject) => {
        const request = objectStore.get(uniqueID);
        request.onsuccess = (event: Event) => {
            const result: Movie | TV = copyMedia((event.target as IDBRequest).result);

            resolve(result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export function libraryGetAll() {
    const objectStore = createObjectStore();

    return new Promise<(Movie | TV)[]>((resolve, reject) => {
        const request = objectStore.getAll();
        request.onsuccess = (event: Event) => {
            let movieArrayDB = (event.target as IDBRequest).result;
            let mediaArray: (Movie | TV)[] = [];
            for (let i = 0; i < movieArrayDB.length; i++) {
                mediaArray.push(copyMedia(movieArrayDB[i]));
            }

            resolve(mediaArray);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
