import { Globals } from "../interfaces/interfaces";
import { DBGetAll, objectStoreNameLibrary } from "./indexedDB";
import { GridItems } from "./searchResults";

export async function setupLibraryPage(GLOBALS: Globals) {
    const { setContent } = GLOBALS.SETTERS;
    const movieArray = (await DBGetAll(objectStoreNameLibrary)).filter((media) => media.inLibrary);

    setContent(
        <>
            <div
                className="grid-container"
                id="searchResults"
            >
                {GridItems(GLOBALS, movieArray)}
            </div>
        </>
    );
}
