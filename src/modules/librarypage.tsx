import { libraryGetAll } from "./indexedDB";
import { singlePageResults } from "./searchResults";

export async function setupLibraryPage(GLOBALS: any) {
    const { setContent } = GLOBALS.SETTERS;
    const movieArray = await libraryGetAll();

    setContent(
        <>
            <div
                className="grid-container"
                id="searchResults"
            >
                {singlePageResults(GLOBALS, movieArray)}
            </div>
        </>
    );
}
