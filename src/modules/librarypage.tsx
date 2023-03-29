import { libraryGetAll } from "./indexedDB";
import { GridItems } from "./searchResults";

export async function setupLibraryPage(GLOBALS: any) {
    const { setContent } = GLOBALS.SETTERS;
    const movieArray = await libraryGetAll();

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
