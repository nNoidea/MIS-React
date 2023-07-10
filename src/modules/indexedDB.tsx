import { Media, Movie, TV, copyMedia } from "../classes/Media";

const versionNumber = 9;
const databaseName = "media";
export const objectStoreNameLibrary = "cache";
// export const objectStoreNameWatched = "watched";

// Initiate the database
let db: IDBDatabase | undefined;
const request = indexedDB.open(databaseName, versionNumber);
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;

    // Delete the already existing database if it exists.
    if (db.objectStoreNames.contains(objectStoreNameLibrary)) {
        db.deleteObjectStore(objectStoreNameLibrary);
        // db.deleteObjectStore(objectStoreNameWatched);
    }

    // Create a new 'movies' object if it doesn't exists.
    if (!db.objectStoreNames.contains(objectStoreNameLibrary)) {
        db.createObjectStore(objectStoreNameLibrary, { keyPath: "uniqueID" });
        // db.createObjectStore(objectStoreNameWatched, { keyPath: "uniqueID" });
    }
};

request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
};

request.onerror = () => {
    throw new Error("Database is not initialized!");
};

// Setup the setter / getter object.
function createObjectStoreLibrary(objectStoreName: string) {
    if (!db) {
        throw new Error("Database is not initialized!");
    }
    return db.transaction([objectStoreName], "readwrite").objectStore(objectStoreName);
}

// Methods
export function DBAdd(DBName: string, media: Movie | TV) {
    const objectStore = createObjectStoreLibrary(DBName);
    objectStore.put(media);
}

export function DBRemove(DBName: string, uniqueID: string) {
    const objectStore = createObjectStoreLibrary(DBName);
    objectStore.delete(uniqueID);
}

export async function DBCheck(DBName: string, uniqueID: string): Promise<boolean> {
    const objectStore = createObjectStoreLibrary(DBName);

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

export function DBGet(DBName: string, uniqueID: string): Promise<Movie | TV> {
    const objectStore = createObjectStoreLibrary(DBName);

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

export function DBGetAll(DBName: string) {
    const objectStore = createObjectStoreLibrary(DBName);

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
